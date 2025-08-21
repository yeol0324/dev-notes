import { useReducer, useState } from "react";

type Student = {
  id: string;
  name: string;
  present: boolean;
};

type State = {
  count: number;
  students: Student[];
};

const initialSchoolState: State = {
  count: 0,
  students: [],
};

const ActionKind = {
  ADD_STUDENT: "ADD_STUDENT",
  DEL_STUDENT: "DEL_STUDENT",
  PRESENT_STUDENT: "PRESENT_STUDENT",
  DEL_ALL: "DEL_ALL",
} as const;

const reducer = (
  state: State,
  action: { type: string; payload: Student }
): State => {
  switch (action.type) {
    case ActionKind.ADD_STUDENT: {
      const isDuplicate = state.students.some(
        (student) => student.id === action.payload.id
      );

      if (isDuplicate) {
        alert(`${action.payload.name} 학생은 이미 존재합니다.`);
        return state;
      }
      return {
        ...state,
        count: state.count++,
        students: [...state.students, action.payload],
      };
    }
    case ActionKind.PRESENT_STUDENT: {
      return {
        ...state,
        students: state.students.map((student) => {
          if (student.id === action.payload.id) {
            return { ...student, present: !student.present };
          }
          return student;
        }),
      };
    }
    case ActionKind.DEL_STUDENT: {
      return {
        ...state,
        count: state.count--,
        students: [...state.students.filter((s) => s.id !== action.payload.id)],
      };
    }
    case ActionKind.DEL_ALL:
      return { ...state, count: 0, students: [] };
    default:
      throw new Error();
  }
};
export const UseReducerDemo = () => {
  const [name, setName] = useState<string>("");
  const [studentsInfo, dispatch] = useReducer(reducer, initialSchoolState);

  return (
    <div>
      <h1>출석부</h1>
      <h2>총 학생 수 : {studentsInfo.count}</h2>
      <input
        className="bg-white text-black"
        type="text"
        name="student-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={() =>
          dispatch({
            type: ActionKind.ADD_STUDENT,
            payload: { id: String(Date.now()), name: name, present: false },
          })
        }
      >
        추가
      </button>
      <ul>
        {studentsInfo?.students.map((student) => (
          <li
            key={student.id}
            onClick={() =>
              dispatch({
                type: ActionKind.PRESENT_STUDENT,
                payload: student,
              })
            }
          >
            <span
              style={{
                textDecoration: student.present ? "line-through" : "none",
              }}
            >
              {student.name}
            </span>
            <button
              className="bg-white text-black"
              onClick={() =>
                dispatch({
                  type: ActionKind.DEL_STUDENT,
                  payload: student,
                })
              }
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
