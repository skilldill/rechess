import React, { FC } from "react";
import { CellPos } from "../JSChessEngine";
import { Arrow } from "./Arrow";
import { ArrowCoords } from "./models";
import styles from './ChessBoard.module.css';

type ArrowLayoutType = {
    startArrowCoord: CellPos;
    arrowsCoords: ArrowCoords[];
    grabbingPos: CellPos;
}

export const ArrowLayout: FC<ArrowLayoutType> = (props) => {
    const {
        startArrowCoord,
        arrowsCoords,
        grabbingPos,
    } = props;

    return (
        <div className={styles.arrowsLayer}>
            {(startArrowCoord[0] > -1) && (grabbingPos[0] > -1) ? (
                <Arrow start={startArrowCoord} end={grabbingPos} />
            ) : <></>}
            {arrowsCoords.map((coords, i) => (
                <Arrow key={i} {...coords} />
            ))}
        </div>
    );
}