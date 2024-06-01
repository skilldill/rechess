import React, { FC } from "react";
import { checkIsPossibleMove, getFigureCSS, getFilledArrayBySize } from "./utils";
import styles from './ChessBoard.module.css';
import cn from 'classnames';
import { CellPos, Figure } from "../JSChessEngine";
import { HoldedFigure } from "./HoldedFigure";
import { CHESS_PIECIES_MAP } from "./chessPieciesMap";

const BASE_BOARD_SIZE = 8

type ChessBoardInteractiveLayoutProps = {
    size?: number;
    selectedPos: CellPos;
    possibleMoves: CellPos[];
    markedCells: CellPos[];
    holdedFigure?: Figure;
    grabbingPos: CellPos;
    onHasCheck: (cellPos: CellPos) => boolean;
}

export const ChessBoardInteractiveLayout: FC<ChessBoardInteractiveLayoutProps> = (props) => {
    const { 
        size = BASE_BOARD_SIZE,
        selectedPos,
        possibleMoves,
        holdedFigure,
        grabbingPos,
        markedCells,
        onHasCheck,
    } = props;

    return (
        <div>
            <HoldedFigure 
                holdedFigure={holdedFigure}
                grabbingPos={grabbingPos}
            />
            <div className={styles.interactiveLayout}>
                {getFilledArrayBySize(size).map((_, j) => 
                    <div className={styles.row} key={`interactive-layout-${j}`}>
                        {getFilledArrayBySize(size).map((_, i) => (
                            <div 
                                className={cn(styles.interactiveCell, { 
                                    [styles.selectedCell]: selectedPos[0] === i && selectedPos[1] === j,
                                    [styles.markedCell]: checkIsPossibleMove(markedCells, [i, j]),
                                    [styles.checkedCell]: onHasCheck([i, j])
                                })}
                                key={`interactive-layout-${i}`}
                            >
                                {selectedPos[0] === i && selectedPos[1] === j && holdedFigure && (
                                    <div 
                                        className={cn([
                                            styles.figure,
                                            styles.holdedFigure,
                                        ], {
                                            [styles.bluredFigure]: grabbingPos[0] !== -1,
                                        })}
                                    >
                                        {CHESS_PIECIES_MAP[getFigureCSS(holdedFigure)]('80%')}
                                    </div>
                                )}
                                {checkIsPossibleMove(possibleMoves, [i, j]) && (
                                    <div className={styles.possibleMoveMark} />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}