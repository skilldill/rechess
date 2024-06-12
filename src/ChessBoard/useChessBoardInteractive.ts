import { Cell, CellPos, Figure, FigureColor, JSChessEngine, MoveData, stateToFEN } from "../JSChessEngine";
import { useEffect, useState } from "react"
import { checkIsPossibleMove, checkPositionsHas, getChessBoardConfig, hasCheck } from "./utils";
import { ArrowCoords, ChangeMove, ChessBoardConfig } from "./models";
import { DEFAULT_CHESSBORD_CONFIG } from "./constants";

type UseChessBoardInteractiveProps = {
  config?: Partial<ChessBoardConfig>;
  onChange: (moveData: MoveData) => void;
}

export const useChessBoardInteractive = (props: UseChessBoardInteractiveProps) => {
  const { onChange, config } = props;

  const [boardConfig, setBoardConfig] = useState(DEFAULT_CHESSBORD_CONFIG);
  const [initialState, setInitialState] = useState<Cell[][]>([]);
  const [actualState, setActualState] = useState<Cell[][]>([]);
  const [fromPos, setFromPos] = useState<CellPos>([-1, -1]);
  const [holdedFigure, setHoldedFigure] = useState<Figure>();
  const [grabbingPos, setGrabbingPos] = useState<CellPos>([-1, -1]);
  const [possibleMoves, setPossibleMoves] = useState<CellPos[]>([]);
  const [boardReversed, setBoardReversed] = useState(false);
  const [currentColor, setCurrentColor] = useState<FigureColor>('white');
  const [playerColor, setPlayerColor] = useState<FigureColor>();
  const [newMove, setNewMove] = useState<ChangeMove>();
  const [linesWithCheck, setLinesWithCheck] = useState<CellPos[][]>([]);
  const [markedCells, setMarkedCells] = useState<CellPos[]>([]);

  const [clickedPos, setClickedPos] = useState<CellPos>([-1, -1]);
  const [clickedFigure, setClickedFigure] = useState<Figure>();
  const [clickPossibleMoves, setClickPossibleMoves] = useState<CellPos[]>([]);

  const [startArrowCoord, setStartArrowCoord] = useState<CellPos>([-1, -1]);
  const [arrowsCoords, setArrowsCoords] = useState<ArrowCoords[]>([]);

  const clearFromPos = () => setFromPos([-1, -1]);
  const clearGrabbingPos = () => setGrabbingPos([-1, -1]);
  const clearPossibleMoves = () => setPossibleMoves([]);
  const clearClickPossibleMoves = () => setClickPossibleMoves([]);
  const toggleCurrentColor = () => setCurrentColor((prevColor) => prevColor === 'white' ? 'black' : 'white');
  const clearMarkedCells = () => setMarkedCells([]);
  const clearClickedPos = () => setClickedPos([-1, -1]);
  const clearArrows = () => setArrowsCoords([]);

  useEffect(() => {
    setBoardConfig(getChessBoardConfig(config));
  }, []);

  const cleanAllForFigure = () => {
    setHoldedFigure(undefined);
    clearFromPos();
    clearGrabbingPos();
    clearPossibleMoves();
  }

  const cleanAllForClickedFigure = () => {
    setClickedFigure(undefined);
    clearClickedPos();
    clearClickPossibleMoves();
  }

  const reverseChessBoard = () => {
    cleanAllForFigure();
    setActualState((prevState) => JSChessEngine.reverseChessBoard(prevState));
    setBoardReversed((prevReversed) => !prevReversed);
  }

  // It's common select for click event and hover event  
  const selectFigureFrom = (cellPos: CellPos) => {
    const cell = actualState[cellPos[1]][cellPos[0]];

    if (!cell.figure) {
      cleanAllForFigure();
      return { figure: undefined, nextMoves: [] };
    }

    const { figure } = cell;

    if (figure.color !== currentColor) {
      cleanAllForFigure();
      return { figure: undefined, nextMoves: [] };
    }

    const nextMoves = JSChessEngine.getNextMoves(
      actualState,
      cellPos,
      linesWithCheck,
      boardReversed
    );

  
    return { figure: cell.figure, nextMoves };
  }

  const selectClickFrom = (cellPos: CellPos) => {
    const { figure, nextMoves } = selectFigureFrom(cellPos);
    if (!figure) return;

    setClickedFigure(figure);
    setClickedPos(cellPos);
    setClickPossibleMoves(nextMoves);
  }

  const selectHoverFrom = (cellPos: CellPos) => {
    const { figure, nextMoves } = selectFigureFrom(cellPos);
    if (!figure) return;

    setHoldedFigure(figure);
    setPossibleMoves(nextMoves);
    setFromPos(cellPos);
  }

  const moveFigure = (from: CellPos, to: CellPos, figure: Figure) => {
    const inNextMoves = checkPositionsHas(possibleMoves, to);

    // Проверка, что начальная позиция не равняется следующей
    // и то что inNextMoves будет true
    const conditionForDoMove =
      (to[0] !== from[0] || to[1] !== from[1]) && inNextMoves;

    if (!conditionForDoMove) return {};

    const { updatedCells, attackedPos } = JSChessEngine.changeState(
      actualState,
      figure,
      to,
      from,
      boardReversed
    );

    const linesCheck = JSChessEngine.getLinesWithCheck(
      updatedCells, 
      currentColor, 
      boardReversed
    );

    setLinesWithCheck(linesCheck);

    // Если playetColor не задан, то
    // Доска работает в режиме анализа
    // Можно менять состояние внутри доски
    if (playerColor === undefined) setActualState(updatedCells);

    // Пешка дошла до конца доски
    // Показываем FigurePicker
    // И изменяем состояние с превращением пешки
    if (
      figure.type === 'pawn' &&
      (to[1] === 0 || to[1] === actualState.length - 1)
    ) {
      // setTargetPos(to);
      // setShowFigurePicker(true);
      return {};
    }

    const colorFEN = currentColor === 'white' ? 'black' : 'white';
    const FEN = stateToFEN(updatedCells, colorFEN)

    // Собранные данные для отправки
    const moveData: MoveData = { figure, from, to, FEN };
    
    // setMoveVector([from, to]);
    // onChange(changedState, moveData);

    toggleCurrentColor();

    setHoldedFigure(undefined);
    clearFromPos();
    clearGrabbingPos();
    clearArrows();
    clearMarkedCells();

    return { moveData, attackedPos };
  }

  const moveFigureByClick = (from: CellPos, to: CellPos, figure: Figure) => {
    const inNextMoves = checkPositionsHas(clickPossibleMoves, to);

    // Проверка, что начальная позиция не равняется следующей
    // и то что inNextMoves будет true
    const conditionForDoMove =
      (to[0] !== from[0] || to[1] !== from[1]) && inNextMoves;

    if (!conditionForDoMove) return {};

    const { updatedCells, attackedPos } = JSChessEngine.changeState(
      actualState,
      figure,
      to,
      from,
      boardReversed
    );

    const linesCheck = JSChessEngine.getLinesWithCheck(
      updatedCells, 
      currentColor, 
      boardReversed
    );

    setLinesWithCheck(linesCheck);

    // Если playetColor не задан, то
    // Доска работает в режиме анализа
    // Можно менять состояние внутри доски
    if (playerColor === undefined) setActualState(updatedCells);

    // Пешка дошла до конца доски
    // Показываем FigurePicker
    // И изменяем состояние с превращением пешки
    if (
      figure.type === 'pawn' &&
      (to[1] === 0 || to[1] === actualState.length - 1)
    ) {
      // setTargetPos(to);
      // setShowFigurePicker(true);
      return {};
    }

    const colorFEN = currentColor === 'white' ? 'black' : 'white';
    const FEN = stateToFEN(updatedCells, colorFEN)

    // Собранные данные для отправки
    const moveData: MoveData = { figure, from, to, FEN };
    
    // setMoveVector([from, to]);
    // onChange(changedState, moveData);

    toggleCurrentColor();

    setClickedFigure(undefined);
    clearClickedPos();
    clearGrabbingPos();
    clearArrows();
    clearMarkedCells();

    return { moveData, attackedPos };
  }

  const handleGrabbing = (x: number, y: number) => {
    setGrabbingPos([x, y]);
  }

  const handleGrabEnd = (cellPos: CellPos, withTransition = false) => {
    if (fromPos[0] === -1) {
      clearGrabbingPos();
      return;
    }

    if (!holdedFigure) {
      return;
    }

    if (possibleMoves.length === 0) {
      clearGrabbingPos();
      return;
    }
    
    const foundPosInPossible = checkIsPossibleMove(possibleMoves, cellPos);

    if (!foundPosInPossible) {
      clearGrabbingPos();
      return;
    }
    
    const { moveData, attackedPos } = moveFigure(fromPos, cellPos, holdedFigure);
    if (!moveData) {
      clearGrabbingPos();
      return;
    }

    onChange(moveData);

    setNewMove({ move: moveData, withTransition, attackedPos });

    clearGrabbingPos();
    clearPossibleMoves();
  }

  const handleClickForTargetCell = (cellPos: CellPos, withTransition = false) => {
    if (clickedPos[0] === -1) return;
    if (!clickedFigure) return;
    if (clickPossibleMoves.length === 0) return;
    const foundPosInPossible = checkIsPossibleMove(clickPossibleMoves, cellPos);

    if (!foundPosInPossible) return;
    
    const { moveData, attackedPos } = moveFigureByClick(clickedPos, cellPos, clickedFigure);
    if (!moveData) return;

    onChange(moveData);

    setNewMove({ move: moveData, withTransition, attackedPos });

    clearClickedPos();
    clearClickPossibleMoves();
  }

  const handleClick = (cellPos: CellPos) => {
    clearMarkedCells();
    clearArrows();

    if (clickedPos[0] === -1) {
      selectClickFrom(cellPos);
      return;
    }

    const foundPosInPossible = checkIsPossibleMove(clickPossibleMoves, cellPos);
    if (!foundPosInPossible) {
      cleanAllForClickedFigure();
      return;
    }

    handleClickForTargetCell(cellPos, true);
  }

  const markCell = (cellPos: CellPos) => {
    cleanAllForFigure();

    setMarkedCells((prev) => {
      const preparedPrev = [...prev];
      
      const foundCellIndex = preparedPrev.findIndex(([x, y]) => x === cellPos[0] && y === cellPos[1]);
      if (foundCellIndex !== -1) return prev.filter((_, i) => i !== foundCellIndex);
      return [...preparedPrev, cellPos];
    });
  }
  
  const getHasCheckByCellPos = ([x, y]: CellPos) => {
    if (actualState.length === 0) return false;
    const cell = actualState[y][x];
    if (!cell.figure) return false;
    return hasCheck(cell, currentColor, linesWithCheck);
  }

  const startRenderArrow = (pos: CellPos) => {
    const startPos: CellPos = [
      (pos[0] + 1) * boardConfig.cellSize - boardConfig.cellSize / 2 - 10,
      (pos[1] + 1) * boardConfig.cellSize - boardConfig.cellSize / 2,
    ];

    setStartArrowCoord(startPos);
  }

  const endRenderArrow = ([x, y]: CellPos) => {
    if (startArrowCoord[0] === -1) return;

    setArrowsCoords((arrows) => {
      const copiedArrows = [...arrows];

      return [
        ...copiedArrows, 
        { 
          start: [...startArrowCoord], 
          end: [
            (x * boardConfig.cellSize) + (boardConfig.cellSize / 2 - 10), 
            (y * boardConfig.cellSize) + (boardConfig.cellSize / 2),
          ],
        }
      ];
    });

    setStartArrowCoord([-1, -1]);
  }

  return {
    fromPos,
    newMove,
    boardConfig,
    markedCells,
    grabbingPos,
    actualState,
    arrowsCoords,
    initialState,
    holdedFigure,
    possibleMoves,
    linesWithCheck,
    startArrowCoord,

    markCell,
    setNewMove,
    handleClick,
    clearFromPos,
    handleGrabEnd,
    handleGrabbing,
    endRenderArrow,
    setActualState,
    setCurrentColor,
    selectClickFrom,
    selectHoverFrom,
    setInitialState,
    startRenderArrow,
    reverseChessBoard,
    getHasCheckByCellPos,
  }
}
