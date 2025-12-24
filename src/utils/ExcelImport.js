import * as XLSX from 'xlsx';

export const parseInspectorExcel = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Assume first sheet is the target
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Convert to Array of Arrays (Matrix) to handle complex headers
                const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                console.log("Raw Excel Rows (First 5):", rawRows.slice(0, 5));

                // Find Header Row (Look for "NAMA")
                let headerRowIndex = -1;
                for (let i = 0; i < Math.min(10, rawRows.length); i++) {
                    if (rawRows[i] && rawRows[i].some(cell => cell && cell.toString().toUpperCase().includes('NAMA'))) {
                        headerRowIndex = i;
                        break;
                    }
                }

                if (headerRowIndex === -1) {
                    throw new Error("Could not find 'NAMA' or 'Name' column header.");
                }

                const headers = rawRows[headerRowIndex];
                const dataRows = rawRows.slice(headerRowIndex + 1);

                const inspectors = dataRows.filter(row => row && row.length > 1).map((row, index) => {
                    // 1. Basic Info
                    // Find index of Name
                    const nameIndex = headers.findIndex(h => h && h.toString().toUpperCase().includes('NAMA'));
                    const officeIndex = headers.findIndex(h => h && h.toString().toUpperCase().includes('KANTOR')); // Using as "Working Unit" or "Subdirectorate"?

                    const name = row[nameIndex] || 'Unknown Name';
                    if (!name || name === 'Unknown Name') return null; // Skip empty rows

                    // Generate ID
                    const id = `INS-${Date.now()}-${index}`;

                    // 2. Training Log Extraction
                    // Based on user screenshot: 
                    // Columns D(3), E(4), F(5), G(6), H(7) are DATES
                    // Columns I(8), J(9), K(10), L(11), M(12) are STATUS ("valid"/"expired")
                    // We need to confirm if this pattern holds. 
                    // Let's iterate through headers to find "Indoctrination", "Certification", etc.

                    const mandatoryLog = { current: [], outstanding: [] };

                    // We assume the first set of columns are dates, and simpler labeled columns follow?
                    // Or we just scan for known keywords in headers.

                    headers.forEach((header, colIndex) => {
                        if (!header) return;
                        const headerStr = header.toString(); // e.g. "Indoctrination 1001"

                        // 1. Extract Code (e.g. "1001")
                        const codeMatch = headerStr.match(/(\d{4})/);
                        const code = codeMatch ? codeMatch[0] : '0000';
                        const courseName = headerStr.replace(codeMatch ? codeMatch[0] : '', '').trim();

                        // 2. Identify is this a 'Date' column for a mandatory course?
                        // We filter by known keywords AND check we are in the 'Date' section (columns D-H, i.e., indices 3-7) based on the visual layout.
                        const keywords = ['Indoctrination', 'Certification', 'Surveillance', 'Personnel Licensing', 'Law Enforcement'];
                        const isMandatoryType = keywords.some(k => headerStr.includes(k));

                        // Constraint: Only process if it's likely a Date column (left side of matrix) to avoid double-counting the Status columns (right side)
                        // "Structure is: [No][Nama][Kantor][Date1][Date2][Date3][Date4][Date5][Status1][Status2]..."
                        // Indices: 0, 1, 2, 3, 4, 5, 6, 7, 8...
                        if (isMandatoryType) {
                            // Check if this is the DATE column (left side) or STATUS column (right side)
                            // We assume strict structure where Date comes first.
                            // If we encounter the "Status" column (which has same header), we should SKIP it here to avoid duplicates, 
                            // because we process the pair when we hit the Date column.

                            // How to distinguish?
                            // 1. Check if there's a column +5 with roughly same header? 
                            // 2. OR check if column -5 has same header?

                            const potentialDatePair = headers[colIndex - 5];
                            if (potentialDatePair && potentialDatePair.toString() === headerStr) {
                                // This is likely the STATUS column (the second one), so we SKIP it.
                                return;
                            }

                            const cellValues = row[colIndex];
                            const statusColIndex = colIndex + 5;
                            const statusContent = row[statusColIndex];

                            console.log(`Processing ${headerStr}: DateVal=${cellValues}, StatusVal=${statusContent}`);

                            // Only proceed if we have meaningful data
                            if (!cellValues && !statusContent) return;

                            let status = 'Valid'; // Default
                            if (statusContent && typeof statusContent === 'string') {
                                status = statusContent.toLowerCase().includes('expired') ? 'Expired' : 'Valid';
                            }

                            // Format Date
                            let formattedDate = '-';
                            if (cellValues) {
                                if (typeof cellValues === 'number') {
                                    // Excel Date Serial
                                    const dateObj = new Date(Math.round((cellValues - 25569) * 86400 * 1000));
                                    formattedDate = dateObj.toISOString().split('T')[0];
                                } else {
                                    formattedDate = cellValues.toString();
                                }
                            }

                            const record = {
                                code: code,
                                name: courseName,
                                fcnName: courseName,
                                provider: 'Internal',
                                expired: formattedDate,
                                status: status
                            };
                            console.log("Record pushed:", record);

                            if (status === 'Valid') {
                                mandatoryLog.current.push(record);
                            } else {
                                // For expired/outstanding
                                mandatoryLog.outstanding.push({
                                    ...record,
                                    type: 'Mandatory',
                                    lastDueDate: formattedDate
                                });
                            }
                        }
                    });

                    return {
                        id: id,
                        name: name,
                        role: 'Inspector', // Default as not provided in Excel
                        domain: 'Flight Operations', // Default
                        group: 'Unassigned',
                        subdirectorate: row[officeIndex] || 'DKPPU',
                        workingUnit: 'DKPPU',
                        avatar: 'https://i.pravatar.cc/150?u=' + name,
                        avatar: 'https://i.pravatar.cc/150?u=' + name,
                        stats: {
                            formal: (mandatoryLog.current.length + mandatoryLog.outstanding.length) > 0
                                ? Math.round((mandatoryLog.current.length / (mandatoryLog.current.length + mandatoryLog.outstanding.length)) * 100)
                                : 0,
                            ojt: 0 // Default to 0 as OJT is not yet parsed from Excel
                        },
                        trainingLog: {
                            mandatory: mandatoryLog,
                            nonMandatory: [],
                            ojt: [],
                            authorization: []
                        }
                    };
                }).filter(Boolean); // Remove nulls

                resolve(inspectors);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};
