import React from "react";
import {PredictionResult} from "@/utils/PredictionResult";
import {GroupedDistributionChart} from "@/components/GroupedDistributionChart";

interface HPONodeProps {
    node: PredictionResult;
    isExpanded?: boolean;
    onSelect: (node: PredictionResult | null) => void;
    onToggleExpand?: () => void;
    isCompleted?: boolean;
}

export const HPONode = ({
                            node,
                            isExpanded = false,
                            onSelect,
                            onToggleExpand,
                            isCompleted = node.probability > 0
                        }: HPONodeProps) => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(isExpanded ? null : node);
        if (onToggleExpand) {
            onToggleExpand();
        }
    };

    return (
        <>
            <style jsx global>{`
                .tree-node {
                    padding: 1rem;
                    border-radius: 12px;
                    margin: 0.5rem 0;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    border-left: 4px solid transparent;
                }

                .tree-node:hover {
                    transform: translateX(5px);
                }

                .tree-node.positive {
                    background: linear-gradient(135deg, #d4eddb, #c3e6c8);
                    border-left-color: #28a741;
                }

                .tree-node.uncertain {
                    background: linear-gradient(135deg, #ede3d4, #e6dac3);
                    border-left-color: #a78e28;
                }

                .tree-node.negative {
                    background: linear-gradient(135deg, #f8d7da, #f5c6cb);
                    border-left-color: #dc3545;
                }

                .confidence-bar {
                    height: 8px;
                    border-radius: 4px;
                    background: #e9ecef;
                    overflow: hidden;
                    margin-top: 0.5rem;
                }

                .confidence-fill {
                    height: 100%;
                    transition: width 0.8s ease;
                    border-radius: 4px;
                }

                .positive-fill {
                    background: linear-gradient(90deg, #28a745, #20c997);
                }

                .negative-fill {
                    background: linear-gradient(90deg, #dc3545, #fd7e14);
                }
            `}</style>
            <div
                className={`tree-node ${!isCompleted ? "pending" : node.isPositive ? "positive" : "negative"} mb-2 ${isExpanded ? 'expanded' : ''}`}
                onClick={handleClick}
            >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-1">
                    {/* Status + Name */}
                    <div className="text-truncate me-2 flex-grow-1" style={{maxWidth: '70%'}}>
                        <i className={`fas ${!isCompleted ? "fa-circle-notch fa-spin text-muted" : node.isPositive ? "fa-check-circle text-success" : "fa-info-circle text-muted"} me-2`}></i>
                        <strong className="text-dark">{node.name}</strong>
                    </div>

                    {/* Confidence Badge */}
                    <span
                        className={`badge ${!isCompleted ? "bg-light text-muted border" : node.isPositive ? "bg-success" : "bg-danger border"} shadow-sm`}>
          {isCompleted ? `${(node.probability * 100).toFixed(1)}%` : "Pending"}
        </span>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                    <div
                        className="node-details small text-dark mt-2 p-3 bg-white bg-opacity-75 rounded border border-secondary-subtle">

                        {/* HPO ID & Description */}
                        <div className="mb-3">
                            <strong className="text-primary">ID:</strong> <span
                            className="bg-light px-1 py-px rounded">{node.hpoId || node.id}</span>
                            {node.description && (
                                <div className="mt-2">
                                    <strong>Description: </strong>
                                    <span className="text-muted">{node.description}</span>
                                </div>
                            )}
                        </div>

                        {/* Performance Metrics */}
                        {node.metrics && (
                            <div className="mt-3">
                                <h6 className="fw-bold border-bottom pb-1 small mb-2 text-primary">Performance
                                    Metrics</h6>
                                <div className="row g-2 text-center">
                                    {/*<div className="col-4">*/}
                                    {/*    <div*/}
                                    {/*        className="p-1 bg-light rounded border border-secondary-subtle">*/}
                                    {/*        <div*/}
                                    {/*            className="small text-muted"*/}
                                    {/*            style={{fontSize: '0.65rem'}}>AUROC*/}
                                    {/*        </div>*/}
                                    {/*        <div*/}
                                    {/*            className="fw-bold">{(node.metrics.auroc * 100).toFixed(1)}%*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    <div className="col-6">
                                        <div
                                            className="p-1 bg-light rounded border border-secondary-subtle">
                                            <div
                                                className="small text-muted"
                                                style={{fontSize: '0.65rem'}}>Sensitivity
                                            </div>
                                            <div
                                                className="fw-bold">{(node.metrics.recall * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div
                                            className="p-1 bg-light rounded border border-secondary-subtle">
                                            <div
                                                className="small text-muted"
                                                style={{fontSize: '0.65rem'}}>Specificity
                                            </div>
                                            <div
                                                className="fw-bold">{(node.metrics.specificity * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-2">
                                    <div
                                        className="small text-muted mb-1 fw-bold"
                                        style={{fontSize: '0.75rem'}}>Confusion
                                        Matrix
                                    </div>
                                    <div
                                        className="row g-0 border rounded overflow-hidden"
                                        style={{maxWidth: '200px'}}>
                                        <div
                                            className="col-6 p-2 text-center bg-success bg-opacity-10 border-end border-bottom">
                                            <div className="text-muted"
                                                 style={{fontSize: '0.6rem'}}>True Positive
                                            </div>
                                            <div
                                                className="fw-bold small">{((node.metrics.tp / (node.metrics.tp + node.metrics.fn)) * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                        <div
                                            className="col-6 p-2 text-center bg-danger bg-opacity-10 border-bottom">
                                            <div className="text-muted"
                                                 style={{fontSize: '0.6rem'}}>False Positive
                                            </div>
                                            <div
                                                className="fw-bold small">{((node.metrics.fp / (node.metrics.fp + node.metrics.tn)) * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                        <div
                                            className="col-6 p-2 text-center bg-danger bg-opacity-10 border-end">
                                            <div className="text-muted"
                                                 style={{fontSize: '0.6rem'}}>False Negative
                                            </div>
                                            <div
                                                className="fw-bold small">{((node.metrics.fn / (node.metrics.tp + node.metrics.fn)) * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                        <div
                                            className="col-6 p-2 text-center bg-success bg-opacity-10">
                                            <div className="text-muted"
                                                 style={{fontSize: '0.6rem'}}>True Negative
                                            </div>
                                            <div
                                                className="fw-bold small">{((node.metrics.tn / (node.metrics.fp + node.metrics.tn)) * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Training Data Section */}
                        {node.database?.affected && node.database?.unaffected && (
                            <div className="mt-3">
                                <h6 className="fw-bold border-bottom pb-1 small mb-2 text-primary">
                                    Training Data Distribution
                                </h6>

                                <div className="row g-3">
                                    {/* Gender */}
                                    <div className="col-lg-3 col-md-6">
                                        <GroupedDistributionChart
                                            title="Gender"
                                            categories={node.database.affected.gender}
                                            affected={node.database.affected.gender}
                                            unaffected={node.database.unaffected.gender}
                                        />
                                    </div>

                                    {/* Ethnicity */}
                                    <div className="col-lg-3 col-md-6">
                                        <GroupedDistributionChart
                                            title="Ethnicity"
                                            categories={node.database.affected.ethnicity}
                                            affected={node.database.affected.ethnicity}
                                            unaffected={node.database.unaffected.ethnicity}
                                        />
                                    </div>

                                    {/* Age Groups */}
                                    <div className="col-lg-3 col-md-6">
                                        <GroupedDistributionChart
                                            title="Age Groups"
                                            categories={node.database.affected.ageGroups}
                                            affected={node.database.affected.ageGroups}
                                            unaffected={node.database.unaffected.ageGroups}
                                        />
                                    </div>

                                    {/* Database Sources */}
                                    <div className="col-lg-3 col-md-6">
                                        <GroupedDistributionChart
                                            title="Sources"
                                            categories={node.database.affected.databaseSource}
                                            affected={node.database.affected.databaseSource}
                                            unaffected={node.database.unaffected.databaseSource}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Syndromes Section */}
                        {node.syndromes && node.syndromes.length > 0 && (
                            <div className="mt-3">
                                <h6 className="fw-bold border-bottom pb-1 small mb-2 text-primary">Syndromes
                                    in Data Distribution</h6>
                                <div className="d-flex flex-wrap gap-1">
                                    {node.syndromes.map((s, idx) => (
                                        <span key={idx}
                                              className="badge bg-secondary bg-opacity-10 text-dark border small"
                                              style={{fontSize: '0.65rem'}}>
                                                                                        {s.name} ({s.count})
                                                                                    </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </>
    )
        ;
};
