export interface HPOModel {
    id: string;
    name: string;
    description: string;
    url: string;
    parent: string | null;
    metaData: string[];
    importanceValues: {string: number};
    feature_importance_threshold: number;
    metrics?: {
        accuracy: number;
        auroc: number;
        f1: number;
        precision: number;
        recall: number; // Sensitivity
        specificity: number;
        tp: number;
        fp: number;
        tn: number;
        fn: number;
    };
    database?: {
        affected: {
            gender: { [key: string]: number };
            ethnicity: { [key: string]: number };
            ageGroups: { [key: string]: number };
            databaseSource: { [key: string]: number };
        },
        unaffected: {
            gender: { [key: string]: number };
            ethnicity: { [key: string]: number };
            ageGroups: { [key: string]: number };
            databaseSource: { [key: string]: number };
        }
    };
    syndromes?: { name: string; count: number }[];
}