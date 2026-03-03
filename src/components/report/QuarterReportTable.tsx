import React, { useState } from 'react';
import type { QuarterReportData, MonthStats, Quarter } from '../../utils/types';

interface QuarterReportTableProps {
    data: QuarterReportData;
    printMode?: boolean;
    onDataChange?: (data: QuarterReportData) => void;
}

const QUARTER_LABELS: Record<Quarter, string> = {
    Q1: "1st Quarter", Q2: "2nd Quarter", Q3: "3rd Quarter", Q4: "4th Quarter",
};

interface RowDef {
    num: number;
    label: string;
    key: keyof MonthStats;
    isText?: boolean;
}

const ROWS: RowDef[] = [
    { num: 1,  label: "Number of persons in the work of sr Apostolate",                              key: "personsInWork" },
    { num: 2,  label: "Number of boys in contact",                                                    key: "boysInContact" },
    { num: 3,  label: "Number of boys going regularly (every 2 weeks at least) to spiritual direction with sacd of the work", key: "boysGoingToSD" },
    { num: 4,  label: "Number of boys that attend classes of doctrine and human formation (average per week)", key: "boysDoctrineAvg" },
    { num: 5,  label: "Number of boys that attend catechism classes",                                key: "catechismBreakdown", isText: true },
    { num: 6,  label: "Number of circles (prep classes)",                                            key: "numCircles" },
    { num: 7,  label: "Number of boys attending circles",                                             key: "boysAttendingCircles" },
    { num: 8,  label: "Number of professional classes",                                              key: "numProfClasses" },
    { num: 9,  label: "Number of boys attending professional classes",                               key: "boysAttendingProfClasses" },
    { num: 10, label: "Number of boys that have visited the poor of our lady",                      key: "boysVisitedPoor" },
    { num: 11, label: "Number of boys teaching catechism",                                           key: "boysTeachingCatechism" },
    { num: 12, label: "Number of meditations held",                                                  key: "numMeditations" },
    { num: 13, label: "Number of boys attending meditations (average per week)",                    key: "boysAttendingMeditationsAvg" },
    { num: 14, label: "Number of Monthly retreats",                                                  key: "numMonthlyRetreats" },
    { num: 15, label: "Boys attending monthly retreats (Total for the month)",                      key: "boysMonthlyRetreats" },
    { num: 16, label: "Number of Long retreats",                                                     key: "numLongRetreats" },
    { num: 17, label: "Boys that have attended long retreats",                                       key: "boysLongRetreats" },
    { num: 18, label: "Boys that have attended cv",                                                  key: "boysAttendedCV" },
    { num: 19, label: "Total number of sr boys",                                                     key: "totalSRBoys" },
];

export const QuarterReportTable: React.FC<QuarterReportTableProps> = ({ data, printMode = false, onDataChange }) => {
    const [editedData, setEditedData] = useState<QuarterReportData>(data);
    const [editingCell, setEditingCell] = useState<string | null>(null);

    const months = editedData.months;

    const isMultiline = (key: keyof MonthStats) => key === "catechismBreakdown";

    const tblBorder = printMode ? "1px solid #333" : "1.5px solid #334155";
    const headerBg  = printMode ? "#f0f0f0" : "#1e293b";
    const headerClr = printMode ? "#1a1a1a" : "#f8f8f8";
    const rowEven   = printMode ? "#ffffff" : "rgba(255,255,255,0.01)";
    const rowOdd    = printMode ? "#f8f8f8" : "rgba(255,255,255,0.04)";
    const cellBdr   = printMode ? "1px solid #ccc" : "1px solid rgba(255,255,255,0.07)";
    const numClr    = printMode ? "#1a1a1a" : "#64748b";
    const labelClr  = printMode ? "#111" : "#111";
    const valueClr  = printMode ? "#1a1a1a" : "#1a1a1a";
    const titleClr  = printMode ? "#1a1a1a" : "#1a1a1a";
    const subtitleClr = printMode ? "#333" : "#64748b";

    const thBase: React.CSSProperties = {
        padding: "12px 8px", fontWeight: 700,
        textAlign: "center", letterSpacing: "0.06em",
    };
    const tdBase: React.CSSProperties = { padding: "10px 8px", verticalAlign: "middle" };

    const getCellId = (monthIndex: number, key: keyof MonthStats) => `${monthIndex}-${key}`;

    const handleCellClick = (monthIndex: number, key: keyof MonthStats) => {
        if (printMode) return;
        setEditingCell(getCellId(monthIndex, key));
    };

    const handleCellChange = (monthIndex: number, key: keyof MonthStats, value: string) => {
        const newMonths = [...editedData.months];
        const currentValue = newMonths[monthIndex][key];
        
        // Handle different data types
        let parsedValue: any = value;
        if (typeof currentValue === 'number') {
            parsedValue = parseFloat(value) || 0;
        }
        
        newMonths[monthIndex] = {
            ...newMonths[monthIndex],
            [key]: parsedValue
        };
        
        const newEditedData = {
            ...editedData,
            months: newMonths
        };
        
        setEditedData(newEditedData);
        if (onDataChange) {
            onDataChange(newEditedData);
        }
    };

    const handleCellBlur = () => {
        setEditingCell(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            setEditingCell(null);
        }
    };

    const cellVal = (m: MonthStats, key: keyof MonthStats) => {
        const monthIndex = months.indexOf(m);
        return editedData.months[monthIndex][key];
    };

    return (
        <div style={{
            fontFamily: printMode ? "'Times New Roman', serif" : "'Crimson Pro', Georgia, serif",
            background: printMode ? "#fff" : "transparent",
            padding: printMode ? 0 : 0,
        }}>
            {/* Title block */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{
                    fontFamily: printMode ? "'Arial', sans-serif" : "'Outfit', sans-serif",
                    fontSize: printMode ? 15 : 17,
                    fontWeight: 800,
                    color: titleClr,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                }}>
                    {data.centre} STATISTICS {QUARTER_LABELS[data.quarter].toUpperCase()} {data.year}
                </div>
                <div style={{ fontSize: 11, color: subtitleClr, marginTop: 4, fontFamily: "inherit" }}>
                    Form E6 — Quarterly Activity Report
                </div>
            </div>

            {/* Main table */}
            <div className="overflow-x-auto">
                <table style={{
                    width: "100%",
                    minWidth: "800px",
                    borderCollapse: "collapse",
                    border: tblBorder,
                    fontSize: printMode ? 11 : 13,
                }}>
                    <thead>
                        <tr>
                            <th style={{
                                ...thBase,
                                background: headerBg,
                                color: headerClr,
                                border: cellBdr,
                                width: "6%",
                                fontSize: printMode ? 10 : 11,
                            }}>S/N</th>
                            <th style={{
                                ...thBase,
                                background: headerBg,
                                color: headerClr,
                                border: cellBdr,
                                width: "42%",
                                textAlign: "left",
                                paddingLeft: 12,
                                fontSize: printMode ? 11 : 12,
                                letterSpacing: "0.06em",
                            }}>FORM E6</th>
                            {months.map(m => (
                                <th key={m.month} style={{
                                    ...thBase,
                                    background: headerBg,
                                    color: headerClr,
                                    border: cellBdr,
                                    width: `${52 / months.length}%`,
                                    fontSize: printMode ? 11 : 12,
                                    letterSpacing: "0.06em",
                                }}>{m.month.slice(0, 3).toUpperCase()}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ROWS.map((row, idx) => {
                            const bg = idx % 2 === 0 ? rowEven : rowOdd;
                            // const isMulti = isMultiline(row.key);
                            return (
                                <tr key={row.num} style={{ background: bg }}>
                                    <td style={{
                                        ...tdBase,
                                        border: cellBdr,
                                        textAlign: "center",
                                        color: numClr,
                                        fontWeight: 700,
                                        fontSize: printMode ? 10 : 11,
                                        fontFamily: printMode ? "Arial" : "'JetBrains Mono', monospace",
                                    }}>{row.num}</td>

                                    <td style={{
                                        ...tdBase,
                                        border: cellBdr,
                                        color: labelClr,
                                        lineHeight: 1.5,
                                        paddingLeft: 12,
                                    }}>{row.label}</td>

                                    {months.map((m, monthIndex) => {
                                        const val = cellVal(m, row.key);
                                        const cellId = getCellId(monthIndex, row.key);
                                        const isEditing = editingCell === cellId;
                                        const isMulti = isMultiline(row.key);
                                        
                                        return (
                                            <td 
                                                key={m.month} 
                                                style={{
                                                    ...tdBase,
                                                    border: cellBdr,
                                                    textAlign: isMulti ? "left" : "center",
                                                    color: valueClr,
                                                    fontWeight: isMulti ? 400 : 700,
                                                    fontFamily: isMulti
                                                        ? "inherit"
                                                        : (printMode ? "Arial" : "'JetBrains Mono', monospace"),
                                                    fontSize: isMulti ? (printMode ? 10 : 12) : (printMode ? 11 : 13),
                                                    whiteSpace: isMulti ? "pre-line" : "nowrap",
                                                    lineHeight: isMulti ? 1.8 : 1,
                                                    paddingLeft: isMulti ? 8 : 0,
                                                    cursor: printMode ? 'default' : 'pointer',
                                                    backgroundColor: isEditing ? '#334155' : 'transparent',
                                                }}
                                                onClick={() => handleCellClick(monthIndex, row.key)}
                                            >
                                                {isEditing && !printMode ? (
                                                    <input
                                                        type={row.isText ? "text" : "number"}
                                                        value={val}
                                                        onChange={(e) => handleCellChange(monthIndex, row.key, e.target.value)}
                                                        onBlur={handleCellBlur}
                                                        onKeyDown={handleKeyDown}
                                                        autoFocus
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: '#ffffff',
                                                            fontFamily: 'inherit',
                                                            fontSize: 'inherit',
                                                            fontWeight: 'inherit',
                                                            textAlign: isMulti ? 'left' : 'center',
                                                            width: '100%',
                                                            outline: 'none',
                                                            padding: 0,
                                                            margin: 0,
                                                        }}
                                                    />
                                                ) : (
                                                    <span>{val}</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div style={{
                marginTop: 16,
                fontSize: 10,
                color: subtitleClr,
                textAlign: "right",
                fontFamily: printMode ? "Arial" : "'Outfit', sans-serif",
            }}>
                Generated {new Date().toLocaleDateString("en-US", { dateStyle: "long" })}
            </div>
        </div>
    );
};
