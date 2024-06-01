import React, { FC, MouseEvent, useState } from "react";
import styles from './ChessBoard.module.css';
import { getFilledArrayBySize } from "./utils";
import cn from 'classnames';
import { CellPos } from "../JSChessEngine";

const BASE_BOARD_SIZE = 8

type ChessBoardControlLayoutProps = {
    size?: number;

    onClick: (position: CellPos) => void;
    onGrabStart: (position: CellPos) => void;
    onGrabEnd: (position: CellPos) => void;
    onGrabbing: (x: number, y: number) => void;
    onRightClick: (position: CellPos) => void;
}

export const ChessBoardControlLayout: FC<ChessBoardControlLayoutProps> = (props) => {
    const { 
        size = BASE_BOARD_SIZE, 
        onClick, 
        onGrabStart,
        onGrabEnd,
        onGrabbing,
        onRightClick,
    } = props;

    const [pressed, setPressed] = useState(false);

    const handleClick = (cellPos: CellPos) => {
        onClick(cellPos);
    }

    const handleGrabStart = (cellPos: CellPos) => {
        setPressed(true);
        onGrabStart(cellPos);
    }

    const handleGrabEnd = (cellPos: CellPos) => {
        setPressed(false);
        onGrabEnd(cellPos);
    }

    const handleGrabing = (event: MouseEvent) => {
        if (pressed) {
            const { pageX, pageY} = event;
            onGrabbing(pageX, pageY);
        }
    }

    const handleContextMenu = (cellPos: CellPos) => (event: MouseEvent) => {
        event.preventDefault();
        onRightClick(cellPos);
    }

    return (
        <div 
            className={cn(styles.controlLayout, {[styles.controlLayoutGrabbing]: pressed})}
            onMouseMove={handleGrabing}
        >
            {getFilledArrayBySize(size).map((_, j) => 
                <div className={styles.row} key={`control-layout-${j}`}>
                    {getFilledArrayBySize(size).map((_, i) => (
                        <div 
                            key={`control-layout-${i}`}
                            className={styles.controlCell}
                            onClick={() => handleClick([i, j])}
                            onMouseDown={() => handleGrabStart([i, j])}
                            onMouseUp={() => handleGrabEnd([i, j])}
                            onContextMenu={handleContextMenu([i, j])}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    )
}