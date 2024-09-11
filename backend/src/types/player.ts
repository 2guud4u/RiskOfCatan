import { Resource } from './Board';
import { DevCard } from './Pieces';
export interface Player {
    name: string;
    color: string;
    resources: Map<Resource, number>;
    devCards: DevCard[];
}