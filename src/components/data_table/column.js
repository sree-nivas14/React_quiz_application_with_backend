import ColumnFilter from "./ColumnFilter";

export const COLUMNS = [
  {
    Header: "id",
    accessor: "id",
    Filter: ColumnFilter,
    disableFilters: true,
  },
  {
    Header: "Question",
    accessor: "question",
    // width: 500,
    Filter: ColumnFilter,
    // maxWidth: 400,
    // minWidth: 180,
    // width: 300,
  },
  {
    Header: "Options",
    accessor: "option",
    Filter: ColumnFilter,
    Cell: ({ row }) => {
      return row.original.option.map((e) => (
        <ul>
          <li>{e}</li>
        </ul>
      ));
    },
  },
  {
    Header: "	Correct Answer",
    accessor: "correct_answer",
    Filter: ColumnFilter,
    Cell: ({ row }) => {
      return (
        <div className="text-center">
          <span
            class="badge  bg-success "
            style={{ fontSize: "0.8rem !important" }}
          >
            {row.original.correct_answer}
          </span>
        </div>
      );
    },
  },
  // {
  //   Header: "gender",
  //   accessor: "gender",
  //   Filter: ColumnFilter,
  // },
];
