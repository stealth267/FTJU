import React from 'react';
import type { FirmData } from '../../types'; // Adjusted path
import { characteristicsMap } from '../../utils/constants'; // Adjusted path

export interface PropFirmEvaluationDetailsSectionProps {
    firms: FirmData[];
}

export const PropFirmEvaluationDetailsSection: React.FC<PropFirmEvaluationDetailsSectionProps> = ({ firms }) => {
    const firmsWithPrograms = firms.filter(firm => firm.evaluationPrograms && firm.evaluationPrograms.length > 0);

    if (firmsWithPrograms.length === 0) {
        return (
            <section className="prop-firm-evaluation-details-section">
                <div className="container">
                    <p>No detailed evaluation programs available for comparison.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="prop-firm-evaluation-details-section">
            <div className="container">
                <h2>Detailed Funding Program Comparison</h2>
                {firmsWithPrograms.map(firm => (
                    <div key={firm.id} className="firm-evaluation-block">
                        <header className="firm-evaluation-header">
                            {firm.logoUrl ? (
                                <img src={firm.logoUrl} alt={`${firm.name} logo`} className="firm-evaluation-logo"
                                onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.style.display = 'none';
                                    const placeholder = target.nextSibling as HTMLElement;
                                    if (placeholder && placeholder.classList.contains('firm-evaluation-logo-placeholder')) {
                                        placeholder.style.display = 'flex';
                                    }
                                }}
                                />
                            ) : null}
                            {(!firm.logoUrl && // Conditional placeholder
                                <div className="firm-evaluation-logo-placeholder" style={{display: 'flex'}}>{firm.name.substring(0,1)}</div>
                            )}
                            <h3>{firm.name}</h3>
                        </header>
                        <div className="evaluation-details-table-container">
                            <table className="evaluation-details-table">
                                <thead>
                                    <tr>
                                        <th className="characteristic-col">Characteristic</th>
                                        {firm.evaluationPrograms!.map(program => ( // Added non-null assertion
                                            <th key={program.id}>{program.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {characteristicsMap.map(char => (
                                        <tr key={char.key}>
                                            <td>{char.label}</td>
                                            {firm.evaluationPrograms!.map(program => ( // Added non-null assertion
                                                <td key={`${program.id}-${char.key}`} data-label={program.name}>
                                                    {/* @ts-ignore TODO: Fix type for char.key if necessary */}
                                                    {program[char.key] || 'N/A'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
