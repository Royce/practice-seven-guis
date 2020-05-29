import React, { useRef, useCallback } from 'react';

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useSetRecoilState,
  useRecoilValue,
} from 'recoil';

import memoize from 'lodash.memoize';
import some from 'lodash.some';

const hit = function (coord, { x, y, r }) {
  return Math.pow(coord.x - x, 2) + Math.pow(coord.y - y, 2) <= Math.pow(r, 2);
};

const selectedCircleState = atom({ key: 'selected', default: null });

const circleWithId = memoize((id) =>
  atom({
    key: `Circle${id}`,
    default: { id, x: 0, y: 0, r: 10 },
  })
);

function Circle({ id }) {
  const { x, y, r } = useRecoilValue(circleWithId(id));
  const [selected, setSelected] = useRecoilState(selectedCircleState);
  const isSelected = selected === id;

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
      onClick={() => {
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

const circleListStateWithDetails = selector({
  key: 'circleListStateWithDetails',
  get: ({ get }) => {
    const list = get(circleListState);
    return list.map((id) => get(circleWithId(id)));
  },
});

function Circles() {
  const circleList = useRecoilValue(circleListState);

  return circleList.map((id) => <Circle id={id} key={id} />);
}

function Canvas() {
  const setCircleList = useSetRecoilState(circleListState);
  const circleList = useRecoilValue(circleListStateWithDetails);

  const nextIdRef = useRef(null);
  if (nextIdRef.current === null) nextIdRef.current = getId();
  const [nextCircle, setNextCircle] = useRecoilState(
    circleWithId(nextIdRef.current)
  );

  const addCircle = useCallback(
    ({ x, y }) => {
      setNextCircle((circle) => {
        return { ...circle, x, y };
      });
      setCircleList((prev) => [...prev, nextCircle.id]);
      nextIdRef.current = getId();
    },
    [setCircleList, setNextCircle, nextCircle]
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

      if (!some(circleList, (circle) => hit(coord, circle))) {
        addCircle(coord);
      }
    },
    [circleList, getCoord, addCircle]
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
  return (
    <div>
      <button>Undo</button>
      <button>Redo</button>
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
