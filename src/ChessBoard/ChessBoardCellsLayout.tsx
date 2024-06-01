import React, { FC } from "react";
import styles from './ChessBoard.module.css';
import { getFilledArrayBySize, getIsLightCell } from "./utils";
import cn from 'classnames';

const BASE_BOARD_SIZE = 8;

type ChessBoardCellsLayoutProps = {
    size?: number;
}

export const ChessBoardCellsLayout: FC<ChessBoardCellsLayoutProps> = ({ size = BASE_BOARD_SIZE }) => {
    return (
        <div>
            {getFilledArrayBySize(size).map((_, j) => 
                <div className={styles.row} key={`cells-layout-${j}`}>
                    {getFilledArrayBySize(size).map((_, i) => (
                        <div 
                            className={cn(styles.cell, { [styles.cellLight]: getIsLightCell(j, i) })}
                            key={`cells-layout-${i}`}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    )
}