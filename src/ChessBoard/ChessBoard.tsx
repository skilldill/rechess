import { FENtoGameState, FigureColor, MoveData } from "../JSChessEngine";
import React, { FC, useEffect, useState } from "react";
import styles from './ChessBoard.module.css';
import { ChessBoardCellsLayout } from "./ChessBoardCellsLayout";
import { ChessBoardFiguresLayout } from "./ChessBoardFiguresLayout";
import { ChessBoardControlLayout } from "./ChessBoardControlLayout";
import { useChessBoardInteractive } from "./useChessBoardInteractive";
import { ChessBoardInteractiveLayout } from "./ChessBoardInteractiveLayout";
import { ChangeMove, ChessBoardConfig } from "./models";
import { ArrowLayout } from "./ArrowLayout";
import { getChessBoardConfig } from "./utils";
import { DEFAULT_CHESSBORD_CONFIG } from "./constants";

type ChessBoardProps = {
    FEN: string;
    onChange: (moveData: MoveData) => void;
    color: FigureColor;
    change?: ChangeMove;
    reversed?: boolean;
    config?: Partial<ChessBoardConfig>;
}

export const ChessBoard: FC<ChessBoardProps> = (props) => {
    const { 
        FEN, 
        onChange, 
        change, 
        reversed,
        config,
    } = props;

    const [boardConfig, setBoardConfig] = useState(DEFAULT_CHESSBORD_CONFIG);

    useEffect(() => {
        setBoardConfig(getChessBoardConfig(config));
    }, [config]);

    const {
        initialState,
        fromPos,
        holdedFigure,
        grabbingPos,
        possibleMoves,
        newMove,
        markedCells,
        arrowsCoords,
        startArrowCoord,

        setActualState,
        selectClickFrom,
        startRenderArrow,
        selectHoverFrom,
        handleGrabbing,
        handleGrabEnd,
        handleClick,
        setInitialState,
        setCurrentColor,
        reverseChessBoard,
        setNewMove,
        markCell,
        getHasCheckByCellPos,
        endRenderArrow,
    } = useChessBoardInteractive({ onChange });

    useEffect(() => {
        const { boardState, currentColor } = FENtoGameState(FEN);
        setInitialState(boardState);
        setActualState(boardState);
        setCurrentColor(currentColor);
    }, [FEN]);

    useEffect(() => {
        if (reversed) reverseChessBoard();
    }, [reversed]);

    useEffect(() => {
        setNewMove(change);
    }, [change]);

    return (
        <div className={styles.chessBoard}>
            <ChessBoardCellsLayout boardConfig={boardConfig} />
            <ChessBoardFiguresLayout 
                initialState={initialState}
                change={newMove}
                reversed={reversed}
                boardConfig={boardConfig}
            />
            <ChessBoardInteractiveLayout
                selectedPos={fromPos}
                possibleMoves={possibleMoves}
                holdedFigure={holdedFigure}
                grabbingPos={grabbingPos}
                markedCells={markedCells}
                boardConfig={boardConfig}
                onHasCheck={getHasCheckByCellPos}
            />
            <ArrowLayout 
                arrowsCoords={arrowsCoords}
                startArrowCoord={startArrowCoord}
                grabbingPos={grabbingPos}
            />
            <ChessBoardControlLayout
                boardConfig={boardConfig}
                onClick={handleClick}
                onGrabStart={selectHoverFrom}
                onGrabStartRight={startRenderArrow}
                onGrabEnd={handleGrabEnd}
                onGrabEndRight={endRenderArrow}
                onGrabbing={handleGrabbing}
                onRightClick={markCell}
            />
        </div>
    )
}