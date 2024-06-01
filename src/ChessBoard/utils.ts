import { Cell, CellPos, Figure, FigureColor, MoveData } from "../JSChessEngine";

/**
 * Возвращает класс для фигуры в клетке
 */
export const getFigureCSS = (figure: Figure) =>
    `${figure.type}-${figure.color}`;

/**
 * Возвращает белая ли клетка
 */
export const getIsLightCell = (rowId: number, cellId: number) =>
    (rowId % 2 === 0) && (cellId % 2 === 0) ||
    (rowId % 2 > 0) && (cellId % 2 > 0)

/**
 * Функция, которая просто создает массив размером size
 */
export const getFilledArrayBySize = (size: number) => {
    const array: number[] = [];

    for (let i = 0; i < size; i++) {
        array.push(i);
    }

    return array;
}

/**
 * Возвращает только массив фигурам у которых
 * есть поле position
 */
export const mapCellsToFiguresArray = (boardState: Cell[][]) => {
    const figuresWithPosition: Figure[] = [];

    boardState.forEach((row, j) => row.forEach((cell, i) => {
        if (cell.figure) {
            figuresWithPosition.push({
                ...cell.figure,
                position: [i, j],
            });
        }
    }));

    return figuresWithPosition;
}

/**
 * 
 * @param possibleMoves Список возможных ходов
 * @param position позиция для проверки
 */
export const checkIsPossibleMove = (possibleMoves: CellPos[], position: CellPos) => {
    return !!possibleMoves.find((possibleMove) =>
        possibleMove[0] === position[0] && possibleMove[1] === position[1]
    );
}

/**
 * Проверяет находится ли проверяемая позиция в
 * наборе позиций
 * @param positions набор позиций
 * @param pos позиция
 */
export const checkPositionsHas = (
    positions: CellPos[] | undefined,
    pos: CellPos
) => {
    if (!positions) return false;

    return !!positions.find(
        (posItem) => posItem[0] === pos[0] && posItem[1] === pos[1]
    );
};

/**
 * Проверяет, является ли ход рокеровкой
 * @param moveData 
 * @returns 
 */
export const checkIsCastlingMove = (moveData: MoveData) => {
    const { figure, from, to } = moveData;
    if (figure.type !== 'king') return false;
    if (from[1] !== to[1]) return false;
    const horizontalDiff = Math.abs(to[0] - from[0]);
    if (horizontalDiff === 1) return false;
    return true;
}

/**
 * Проверка клетки, на то есть ли шах
 */
export const hasCheck = (cell: Cell, currentColor: FigureColor, linesWithCheck: CellPos[][]) => 
    !!cell.figure &&
    cell.figure.type === 'king' &&
    cell.figure.color === currentColor &&
    linesWithCheck.length > 0
