import React from "react";

interface DemographicSelectionProps {
    age: number;
    gender: number;
    ethnicity: number;
    onConfirm: (age: number, gender: number, ethnicity: number) => void;
    onSkip: () => void;
    isOpen: boolean;
}

export const DemographicSelection = ({
                                         age,
                                         gender,
                                         ethnicity,
                                         onConfirm,
                                         onSkip,
                                         isOpen
                                     }: DemographicSelectionProps) => {
    const [localAge, setLocalAge] = React.useState(age);
    const [localGender, setLocalGender] = React.useState(gender);
    const [localEthnicity, setLocalEthnicity] = React.useState(ethnicity);

    // Reset local state wenn neu geöffnet
    React.useEffect(() => {
        setLocalAge(age);
        setLocalGender(gender);
        setLocalEthnicity(ethnicity);
    }, [age, gender, ethnicity, isOpen]);

    if (!isOpen) return null;

    // ✅ Check if values are still DEFAULTS
    const DEFAULTS = {age: 0, gender: -1, ethnicity: -1};
    const isDefault =
        localAge === DEFAULTS.age &&
        localGender === DEFAULTS.gender &&
        localEthnicity === DEFAULTS.ethnicity;

    const handleConfirm = () => {
        onConfirm(localAge, localGender, localEthnicity);
    };

    const handleSkip = () => {
        onSkip();  // Immer Defaults verwenden
    };

    return (
        <>
            <style jsx global>{`
                .upload-area {
                    width: 500px;
                    max-width: 90vw;
                    height: 550px;
                    border: 4px dashed #667eea;
                    border-radius: 20px;
                    background: rgba(102, 126, 234, 0.1);
                    transition: all 0.3s ease;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    overflow: hidden;
                    padding: 2rem;
                }

                .upload-area:hover {
                    border-color: #764ba2;
                    background: rgba(102, 126, 234, 0.15);
                    transform: scale(1.02);
                }

                .upload-area.processing {
                    border-color: #28a745;
                    background: rgba(40, 167, 69, 0.1);
                    pointer-events: none;
                }
            `}</style>
            <div
                className="demographics-overlay position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
                <div className="demographics-form p-4 bg-white rounded-4 shadow-lg"
                     style={{maxWidth: '400px', width: '90vw', maxHeight: '90vh', overflowY: 'auto'}}
                     onClick={(e) => e.stopPropagation()}>

                    <div className="text-center mb-4">
                        <i className="fas fa-user-circle fa-3x text-primary mb-2"></i>
                        <h5 className="fw-bold text-primary mb-1">Patient Demographics</h5>
                        <p className="text-muted small mb-0">Optional - improves prediction accuracy</p>
                    </div>

                    {/* Age */}
                    <div className="mb-4">
                        <label className="form-label fw-bold small text-dark">Age (years)</label>
                        <input
                            type="range"
                            className={`form-range ${localAge === 0 ? 'text-muted' : ''}`}
                            min="0"
                            max="100"
                            value={localAge}
                            onChange={(e) => setLocalAge(Number(e.target.value))}
                        />
                        <input
                            type="number"
                            className="form-control form-control-sm mt-1"
                            value={localAge}
                            onChange={(e) => setLocalAge(Math.max(0, Number(e.target.value)))}
                            min="0"
                            max="120"
                            placeholder="Enter age"
                        />
                        <div className="small text-muted mt-1">
                            {localAge === 0 ? (
                                <span><i className="fas fa-question-circle me-1"></i>Not specified</span>
                            ) : (
                                `${localAge} years`
                            )}
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="mb-4">
                        <label className="form-label fw-bold small text-dark">Gender</label>
                        <select
                            className={`form-select form-select-sm ${localGender === -1 ? 'text-muted' : ''}`}
                            value={localGender}
                            onChange={(e) => setLocalGender(Number(e.target.value))}
                        >
                            <option value="-1">Prefer not to say</option>
                            <option value="0">Female</option>
                            <option value="1">Male</option>
                            <option value="2">Non-binary / Diverse</option>
                        </select>
                    </div>

                    {/* Ethnicity */}
                    <div className="mb-4">
                        <label className="form-label fw-bold small text-dark">Ethnicity</label>
                        <select
                            className={`form-select form-select-sm ${localEthnicity === -1 ? 'text-muted' : ''}`}
                            value={localEthnicity}
                            onChange={(e) => setLocalEthnicity(Number(e.target.value))}
                        >
                            <option value="-1">Prefer not to say</option>
                            <option value="0">European</option>
                            <option value="1">Asian</option>
                            <option value="2">African</option>
                            <option value="3">Other</option>
                        </select>
                    </div>

                    {/* DYNAMIC BUTTONS */}
                    <div className="d-flex gap-2 pt-3 border-top">
                        {isDefault ? (
                            <button
                                className="btn btn-outline-secondary btn-sm flex-grow-1"
                                onClick={handleSkip}
                            >
                                <i className="fas fa-arrow-right me-1"></i> Skip
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary btn-sm flex-grow-1"
                                onClick={handleConfirm}
                            >
                                <i className="fas fa-check me-1"></i> Confirm & Continue
                            </button>
                        )}

                        {/* Reset Button (always visible when default) */}
                        {!isDefault && (
                            <button
                                className="btn btn-outline-danger btn-sm px-2"
                                onClick={() => {
                                    setLocalAge(DEFAULTS.age);
                                    setLocalGender(DEFAULTS.gender);
                                    setLocalEthnicity(DEFAULTS.ethnicity);
                                }}
                                title="Reset to defaults"
                            >
                                <i className="fas fa-undo"></i>
                            </button>
                        )}
                    </div>

                    {/* Legend */}
                    <div className="mt-3 pt-2 text-center small text-muted">
                        <div className="d-flex justify-content-center align-items-center gap-2 mb-1">
                            <div
                                className="bg-light border rounded-circle p-1 d-flex align-items-center justify-content-center"
                                style={{width: '18px', height: '18px'}}>
                                <span className="text-muted" style={{fontSize: '0.6rem'}}>?</span>
                            </div>
                            <span>{isDefault ? 'Defaults will be used' : 'Custom values selected'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
