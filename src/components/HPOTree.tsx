import { TreeNode } from "@/utils/TreeNode";
import { HPONode } from "@/components/HPONode";
import { PredictionResult } from "@/utils/PredictionResult";
import React, { useMemo } from "react";

interface HPOTreeProps {
    nodes: TreeNode[];
    searchTerm: string;
    expandedId: string | null;
    onSelect: (node: PredictionResult | null) => void;
    onToggleExpand: (id: string) => void;
}

export const HPOTree = ({
    nodes,
    searchTerm,
    expandedId,
    onSelect,
    onToggleExpand
}: HPOTreeProps) => {
    const filteredNodes = useMemo(() => {
        const lowerSearch = searchTerm.trim().toLowerCase();

        if (!lowerSearch) return nodes;

        const pruneTree = (tree: TreeNode[]): TreeNode[] =>
            tree.reduce<TreeNode[]>((acc, node) => {
                const matches =
                    node.result.name.toLowerCase().includes(lowerSearch) ||
                    node.result.hpoId?.toLowerCase().includes(lowerSearch);

                const prunedChildren = pruneTree(node.children);

                if (!matches && prunedChildren.length === 0) return acc;

                acc.push({
                    ...node,
                    children: prunedChildren
                });

                return acc;
            }, []);

        return pruneTree(nodes);
    }, [nodes, searchTerm]);

    return (
        <div className="hpo-tree">
            <style jsx global>{`
                .hpo-tree {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    width: 100%;
                }

                .hpo-branch {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    gap: 0.1rem;
                    width: 100%;
                }

                .hpo-node-row {
                    --tree-indent: 22px;
                    --gutter-width: 36px;
                    position: relative;
                    width: 100%;
                    padding-left: calc(var(--level, 0) * var(--tree-indent));
                }

                .hpo-node-layout {
                    display: grid;
                    grid-template-columns: var(--gutter-width) minmax(0, 1fr);
                    align-items: start;
                    column-gap: 0.5rem;
                    width: 100%;
                }

                .hpo-node-layout.expanded {
                    grid-template-columns: 1fr;
                }

                .hpo-tree-gutter {
                    position: relative;
                    min-height: 100%;
                    display: flex;
                    justify-content: center;
                }

                .hpo-tree-gutter::before {
                    content: "";
                    position: absolute;
                    top: -14px;
                    bottom: -18px;
                    left: 50%;
                    width: 2px;
                    transform: translateX(-50%);
                    background: linear-gradient(
                        180deg,
                        rgba(148, 163, 184, 0.08) 0%,
                        rgba(59, 130, 246, 0.25) 50%,
                        rgba(148, 163, 184, 0.08) 100%
                    );
                    border-radius: 999px;
                }

                .hpo-tree-gutter.branch-end::before {
                    bottom: 50%;
                }

                .hpo-depth-badge {
                    position: relative;
                    z-index: 1;
                    width: 28px;
                    height: 28px;
                    border-radius: 999px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.72rem;
                    font-weight: 700;
                    color: #334155;
                    background: linear-gradient(180deg, #ffffff 0%, #eef2ff 100%);
                    border: 1px solid rgba(148, 163, 184, 0.35);
                    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
                }

                .hpo-node-content {
                    min-width: 0;
                    width: 100%;
                }

                .hpo-node-layout:not(.expanded) .hpo-node-content {
                    position: relative;
                }

                .hpo-node-layout:not(.expanded) .hpo-node-content::before {
                    content: "";
                    position: absolute;
                    left: -0.9rem;
                    top: 1.1rem;
                    width: 0.9rem;
                    height: 2px;
                    background: rgba(59, 130, 246, 0.18);
                    border-radius: 999px;
                }

                .hpo-node-layout.expanded .hpo-node-content {
                    grid-column: 1 / -1;
                    width: 100%;
                }

                .hpo-node-layout.expanded .hpo-node-card {
                    width: 100%;
                }

                .hpo-children {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    //gap: 0.9rem;
                    //margin-top: 0.1rem;
                }

                .hpo-children::before {
                    content: "";
                    position: absolute;
                    left: calc(var(--level, 0) * var(--tree-indent) + 17px);
                    top: -0.35rem;
                    bottom: 0.6rem;
                    width: 2px;
                    background: linear-gradient(
                        180deg,
                        rgba(59, 130, 246, 0.18) 0%,
                        rgba(148, 163, 184, 0.08) 100%
                    );
                    border-radius: 999px;
                }

                .hpo-children-group-label {
                    margin-left: calc((var(--level, 0) + 1) * var(--tree-indent) + 2.2rem);
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    color: #64748b;
                    margin-bottom: -0.15rem;
                }

                @media (max-width: 768px) {
                    .hpo-node-row {
                        --tree-indent: 14px;
                        --gutter-width: 28px;
                    }

                    .hpo-node-layout {
                        column-gap: 0.7rem;
                    }

                    .hpo-depth-badge {
                        width: 22px;
                        height: 22px;
                        font-size: 0.65rem;
                    }

                    .hpo-children-group-label {
                        margin-left: calc((var(--level, 0) + 1) * var(--tree-indent) + 1.75rem);
                    }
                }
            `}</style>

            {filteredNodes.map((node, index) => (
                <TreeNodeView
                    key={node.result.id}
                    node={node}
                    expandedId={expandedId}
                    onSelect={onSelect}
                    onToggleExpand={onToggleExpand}
                    isLast={index === filteredNodes.length - 1}
                />
            ))}
        </div>
    );
};

interface TreeNodeViewProps {
    node: TreeNode;
    expandedId: string | null;
    onSelect: (node: PredictionResult | null) => void;
    onToggleExpand: (id: string) => void;
    isLast?: boolean;
}

const TreeNodeView = ({
    node,
    expandedId,
    onSelect,
    onToggleExpand,
    isLast = false
}: TreeNodeViewProps) => {
    const { result, children, level } = node;
    const isExpanded = expandedId === result.id;

    const sortedChildren = [...children].sort((a, b) =>
        b.result.isPositive === a.result.isPositive
            ? b.result.probability - a.result.probability
            : b.result.isPositive ? 1 : -1
    );

    return (
        <div className="hpo-branch" style={{ ["--level" as any]: level }}>
            <div className="hpo-node-row" style={{ ["--level" as any]: level }}>
                <div className={`hpo-node-layout ${isExpanded ? "expanded" : ""}`}>
                    {!isExpanded && (
                        <div
                            className={`hpo-tree-gutter ${isLast ? "branch-end" : ""}`}
                            aria-hidden="true"
                        >
                            <span className="hpo-depth-badge">{level}</span>
                        </div>
                    )}

                    <div className="hpo-node-content">
                        <HPONode
                            node={result}
                            isExpanded={isExpanded}
                            onSelect={onSelect}
                            onToggleExpand={() => onToggleExpand(result.id)}
                        />
                    </div>
                </div>
            </div>

            {sortedChildren.length > 0 && (
                <div className="hpo-children" style={{ ["--level" as any]: level }}>
                    {sortedChildren.map((child, index) => (
                        <TreeNodeView
                            key={child.result.id}
                            node={child}
                            expandedId={expandedId}
                            onSelect={onSelect}
                            onToggleExpand={onToggleExpand}
                            isLast={index === sortedChildren.length - 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};