import React, { FC } from "react";
import styles from './ChessBoard.module.css';
import { getFilledArrayBySize, getIsLightCell } from "./utils";
import cn from 'classnames';
import { ChessBoardConfig } from "./models";

const BASE_BOARD_SIZE = 8;

type ChessBoardCellsLayoutProps = {
    size?: number;
    boardConfig: ChessBoardConfig;
}

export const ChessBoardCellsLayout: FC<ChessBoardCellsLayoutProps> = ({ size = BASE_BOARD_SIZE, boardConfig }) => {
    return (
        <div>
            {getFilledArrayBySize(size).map((_, j) => 
                <div className={styles.row} key={`cells-layout-${j}`}>
                    {getFilledArrayBySize(size).map((_, i) => (
                        <div 
                            className={cn(styles.cell, { [styles.cellLight]: getIsLightCell(j, i) })}
                            style={{
                                width: boardConfig.cellSize,
                                height: boardConfig.cellSize,
                            }}
                            key={`cells-layout-${i}`}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    )
}