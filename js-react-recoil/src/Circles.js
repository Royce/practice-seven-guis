import React, { useRef, useCallback, useState } from 'react';

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useSetRecoilState,
  useRecoilValue,
  useRecoilCallback,
  useRecoilTransactionObserver_UNSTABLE,
  useGotoRecoilSnapshot,
} from 'recoil';

import memoize from 'lodash.memoize';

const selectedCircleState = atom({ key: 'selected', default: null });

const circleWithId = memoize((id) => {
  return atom({
    key: `Circle${id}`,
    default: { id, x: 0, y: 0, r: 10 },
  });
});

const circleIsSelected = memoize((id) => {
  return selector({
    key: `circleIsSelected${id}`,
    get: ({ get }) => {
      const selectedId = get(selectedCircleState);
      return id === selectedId;
    },
  });
});

function Circle({ id }) {
  const { x, y, r } = useRecoilValue(circleWithId(id));
  const setSelected = useSetRecoilState(selectedCircleState);
  const isSelected = useRecoilValue(circleIsSelected(id));

  const strokeWidth = 1;

  return (
    <circle
      cx={x}
      cy={y}
      r={r - strokeWidth / 2}
      style={
        isSelected
          ? { fill: 'skyblue', stroke: 'cadetblue', strokeWidth }
          : { fill: 'white', stroke: 'grey', strokeWidth }
      }
      onClick={(e) => {
        e.stopPropagation();
        setSelected(id);
      }}
    />
  );
}

let id = 0;
function getId() {
  return id++;
}

const circleListState = atom({
  key: 'circleListState',
  default: [],
});

function Circles() {
  const circleList = useRecoilValue(circleListState);

  return circleList.map((id) => <Circle id={id} key={id} />);
}

function Canvas() {
  const nextIdRef = useRef(null);
  if (nextIdRef.current === null) nextIdRef.current = getId();

  const addCircle = useRecoilCallback(
    ({ set }) => async ({ x, y }) => {
      const id = nextIdRef.current;
      nextIdRef.current = getId();

      set(circleWithId(id), (circle) => {
        return { ...circle, x, y };
      });
      set(circleListState, (list) => [...list, id]);
    },
    [nextIdRef]
  );

  const svgRef = useRef(null);

  const getCoord = useCallback((e) => {
    const svgEl = svgRef.current;
    const pt = svgEl.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const transformed = pt.matrixTransform(svgEl.getScreenCTM().inverse());
    return { x: transformed.x, y: transformed.y };
  }, []);

  const onClick = useCallback(
    (e) => {
      const coord = getCoord(e);
      addCircle(coord);
    },
    [getCoord, addCircle]
  );

  return (
    <svg
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 200 100"
      width={'600px'}
      xmlns="http://www.w3.org/2000/svg"
      style={{ border: ['1px solid grey'] }}
      ref={svgRef}
      onClick={onClick}
    >
      <Circles />
    </svg>
  );
}

function UndoButtons() {
  const [history, setHistory] = useState({
    past: [],
    current: null,
    future: [],
  });
  const isUndoingRef = useRef(false);

  console.log(history);

  useRecoilTransactionObserver_UNSTABLE(({ snapshot, previousSnapshot }) => {
    if (isUndoingRef.current) {
      isUndoingRef.current = false;
      return;
    }

    setHistory(({ past, current }) => {
      return {
        past: [...past, current || previousSnapshot],
        current: snapshot,
        future: [],
      };
    });
  });

  const gotoSnapshot = useGotoRecoilSnapshot();

  const undo = useCallback(() => {
    setHistory(({ past, current, future }) => {
      if (!past.length) return { past, current, future };

      isUndoingRef.current = true;
      setTimeout(() => {
        // Known bug.
        // If you undo all the way to the initial state and call
        // gotoSnapshot(s), then the useRecoilTransationObserver()
        // does not fire and isUdoingRef is not reset.
        //
        // So we force it back to false after a small delay. Ugh.
        isUndoingRef.current = false;
      }, 30);

      const target = past[past.length - 1];

      gotoSnapshot(target);
      return {
        past: past.slice(0, past.length - 1),
        current: target,
        future: [current, ...future],
      };
    });
  }, [isUndoingRef, gotoSnapshot, setHistory]);

  const redo = useCallback(() => {
    setHistory(({ past, current, future }) => {
      if (!future.length) return { past, current, future };

      isUndoingRef.current = true;
      // setTimeout(() => {
      //   // Known bug.
      //   // If you undo all the way to the initial state and call
      //   // gotoSnapshot(s), then the useRecoilTransationObserver()
      //   // does not fire and isUdoingRef is not reset.
      //   //
      //   // So we force it back to false after a small delay. Ugh.
      //   isUndoingRef.current = false;
      // }, 30);

      const target = future[0];

      gotoSnapshot(target);
      return {
        past: [...past, current],
        current: target,
        future: future.slice(1),
      };
    });
  }, [isUndoingRef, gotoSnapshot, setHistory]);

  return (
    <div>
      <button disabled={history.past.length === 0} onClick={undo}>
        Undo
      </button>
      <button disabled={history.future.length === 0} onClick={redo}>
        Redo
      </button>
    </div>
  );
}

function RadiusWidget() {
  const selectedId = useRecoilValue(selectedCircleState);

  const [{ x, y, r }, setSelectedCircle] = useRecoilState(
    circleWithId(selectedId)
  );

  const onChange = useCallback(
    (event) => setSelectedCircle((c) => ({ ...c, r: event.target.value })),
    [setSelectedCircle]
  );

  if (selectedId === null) return null;
  return (
    <div>
      Circle at ({Math.round(x)}, {Math.round(y)}). Radius: {r}
      <input type={'range'} min={3} max={20} value={r} onChange={onChange} />
    </div>
  );
}

export default function () {
  return (
    <RecoilRoot>
      <UndoButtons />
      <Canvas />
      <RadiusWidget />
    </RecoilRoot>
  );
}
