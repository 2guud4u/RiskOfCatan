import { Resource } from './Board';
import { DevCard } from './Pieces';
export default interface Player {
    name: string;
    color: string;
    resources: Map<Resource, number>;
    devCards: DevCard[];
}

