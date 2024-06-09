import { CellPos, MoveData } from "../JSChessEngine"

export type ChessBoardConfig = {
    cellSize: number;
}

export type ChangeMove = {
    move: MoveData;
    withTransition?: boolean;
    attackedPos?: CellPos; // for pawn and beated field
}

export type ArrowCoords = { start: number[]; end: number[] };
