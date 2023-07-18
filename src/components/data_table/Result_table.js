import React, { useEffect, useMemo, useState } from "react";
import {
  useSortBy,
  useTable,
  useGlobalFilter,
  useFilters,
  useBlockLayout,
  useResizeColumns,
  useExpanded,
  usePagination,
} from "react-table";
import "./Basic_table.css";
import GlobalFilter from "./GlobalFilter";
import ColumnFilter from "./ColumnFilter";
import moment from "moment";

function Result_table({ questions }) {
  const result_header = [
    {
      Header: () => null,
      disableGlobalFilter: true,

      id: "expander", // 'id' is required
      Cell: ({ row }) => (
        <span {...row.getToggleRowExpandedProps()}>
          {row.isExpanded ? (
            <i class="fa-solid fa-sort-down"></i>
          ) : (
            <i class="fa-solid fa-caret-right"></i>
          )}
        </span>
      ),
    },
    {
      Header: "id",
      accessor: "serial_no",
      Filter: ColumnFilter,
      disableFilters: true,
    },
    {
      Header: "Name",
      accessor: "name",
      Filter: ColumnFilter,
    },
    {
      Header: "Email",
      accessor: "email",
      Filter: ColumnFilter,
    },
    {
      Header: "Section 1",
      accessor: "section1",
      Filter: ColumnFilter,

      Cell: ({ row }) => {
        // console.log(typeof JSON.parse(row.original.section1));
        var obj_data = JSON.parse(row.original.section1);
        return (
          <div>
            <span>Score : {obj_data.score}</span>
            <br />
            <span className="text-nowrap">
              Questions : {obj_data.questions}
            </span>
          </div>
        );
      },
    },
    {
      Header: "Section 2",
      accessor: "section2",
      Filter: ColumnFilter,
      Cell: ({ row }) => {
        // console.log(typeof JSON.parse(row.original.section1));
        var obj_data = JSON.parse(row.original.section2);
        return (
          <div>
            <span>Score : {obj_data.score}</span>
            <br />
            <span className="text-nowrap">
              Questions : {obj_data.questions}
            </span>
          </div>
        );
      },
    },
    {
      Header: "Section 3",
      accessor: "section3",
      Filter: ColumnFilter,
      Cell: ({ row }) => {
        // console.log(typeof JSON.parse(row.original.section1));
        var obj_data = JSON.parse(row.original.section3);
        return (
          <div>
            <span>Score : {obj_data.score}</span>
            <br />
            <span className="text-nowrap">
              Questions : {obj_data.questions}
            </span>
          </div>
        );
      },
    },
    {
      Header: "Section 4",
      accessor: "section4",
      Filter: ColumnFilter,
      Cell: ({ row }) => {
        // console.log(typeof JSON.parse(row.original.section1));
        var obj_data = JSON.parse(row.original.section4);
        return (
          <div>
            <span>Score : {obj_data.score}</span>
            <br />
            <span className="text-nowrap">
              Questions : {obj_data.questions}
            </span>
          </div>
        );
      },
    },
    {
      Header: "Details",
      Filter: ColumnFilter,
      Cell: ({ row }) => {
        var date1 = new Date(row.original.login_time);
        var date2 = new Date(row.original.logout_time);

        var diff = date2.getTime() - date1.getTime();

        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;
        var ss = Math.floor(msec / 1000);
        msec -= ss * 1000;

        var grand_total =
          JSON.parse(row.original.section1).score +
          JSON.parse(row.original.section2).score +
          JSON.parse(row.original.section3).score +
          JSON.parse(row.original.section4).score;

        var tot_question_length =
          parseInt(
            JSON.parse(row.original.section1).total_question != ""
              ? JSON.parse(row.original.section1).total_question
              : 0
          ) +
          parseInt(
            JSON.parse(row.original.section2).total_question != ""
              ? JSON.parse(row.original.section2).total_question
              : 0
          ) +
          parseInt(
            JSON.parse(row.original.section3).total_question != ""
              ? JSON.parse(row.original.section3).total_question
              : 0
          ) +
          parseInt(
            JSON.parse(row.original.section4).total_question != ""
              ? JSON.parse(row.original.section4).total_question
              : 0
          );

        return (
          <div>
            <div>Total Score : {grand_total}</div>
            <div>
              Total Questions :{" "}
              {isNaN(tot_question_length) ? "-" : tot_question_length}
            </div>
            <div class="text-nowrap">
              Time duration : {hh + ":" + mm + ":" + ss}
            </div>
            <div class="text-nowrap">
              Date : {moment(row.original.created_at).format("DD-MM-YYYY")}
            </div>
            <div>
              {row.original.google_id ? (
                <div>
                  Login type :
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/fluency/48/google-logo.png"
                    alt="google-logo"
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        );
      },
    },

    {
      Header: "Action",
      disableGlobalFilter: true,

      Cell: ({ row }) => (
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={() => {
            handleShow(row);
          }}
        >
          Show Answers
        </button>
      ),
    },
  ];

  const [arr_value, setarr_value] = useState();
  const section = ["section1", "section2", "section3", "section4"];

  const columns = useMemo(() => result_header, []);
  const data = useMemo(() => questions);
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      // defaultColumn,
    },
    // useBlockLayout,
    // useResizeColumns,
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    prepareRow,
    visibleColumns,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    state,
    setGlobalFilter,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  const handleShow = (row) => {
    setarr_value(JSON.stringify(row.original));
  };

  const renderRowSubComponent = (row) => {
    var data = row.original;
    var obj_data1 = JSON.parse(row.original.section1);
    var obj_data2 = JSON.parse(row.original.section2);
    var obj_data3 = JSON.parse(row.original.section3);
    var obj_data4 = JSON.parse(row.original.section4);

    var date1 = new Date(row.original.login_time);
    var date2 = new Date(row.original.logout_time);

    var diff = date2.getTime() - date1.getTime();

    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;

    var grand_total =
      JSON.parse(row.original.section1).score +
      JSON.parse(row.original.section2).score +
      JSON.parse(row.original.section3).score +
      JSON.parse(row.original.section4).score;

    var tot_question_length =
      parseInt(
        JSON.parse(row.original.section1).questions != "-"
          ? JSON.parse(row.original.section1).questions.split("/").pop()
          : 0
      ) +
      parseInt(
        JSON.parse(row.original.section2).questions != "-"
          ? JSON.parse(row.original.section2).questions.split("/").pop()
          : 0
      ) +
      parseInt(
        JSON.parse(row.original.section3).questions != "-"
          ? JSON.parse(row.original.section3).questions.split("/").pop()
          : 0
      ) +
      parseInt(
        JSON.parse(row.original.section4).questions != "-"
          ? JSON.parse(row.original.section4).questions.split("/").pop()
          : 0
      );
    console.log(data);
    return (
      <div className="row justify-content-start">
        <div className="col-3 col-sm-4 col-md-6  col-xs-3">
          <div class="card">
            <div class="card-body">
              <div class="d-flex flex-column bd-highlight mb-3 border border-2 text-center">
                <div class="py-1 bd-highlight subcomponent_header">Name</div>
                <div class="py-1 bd-highlight">{data.name}</div>
                <div class="py-1 bd-highlight  subcomponent_header">Email</div>
                <div class="py-1 bd-highlight  ">{data.email}</div>
                <div class="py-1 bd-highlight  subcomponent_header">
                  Section 1
                </div>
                <div class="py-1 bd-highlight  ">
                  <div id="content">
                    <div id="left">
                      <div id="object1">Score</div>
                      <div id="object2">Questions</div>
                    </div>

                    <div id="right">
                      <div id="object3">{obj_data1.score}</div>
                      <div id="object4">{obj_data1.questions}</div>
                    </div>
                  </div>
                </div>
                <div class="py-1 bd-highlight  subcomponent_header">
                  Section 2
                </div>
                <div class="py-1 bd-highlight  ">
                  <div id="content">
                    <div id="left">
                      <div id="object1">Score</div>
                      <div id="object2">Questions</div>
                    </div>

                    <div id="right">
                      <div id="object3">{obj_data2.score}</div>
                      <div id="object4">{obj_data2.questions}</div>
                    </div>
                  </div>
                </div>
                <div class="py-1 bd-highlight  subcomponent_header">
                  Section 3
                </div>
                <div class="py-1 bd-highlight  ">
                  <div id="content">
                    <div id="left">
                      <div id="object1">Score</div>
                      <div id="object2">Questions</div>
                    </div>

                    <div id="right">
                      <div id="object3">{obj_data3.score}</div>
                      <div id="object4">{obj_data3.questions}</div>
                    </div>
                  </div>
                </div>
                <div class="py-1 bd-highlight  subcomponent_header">
                  Section 4
                </div>
                <div class="py-1 bd-highlight  ">
                  <div id="content">
                    <div id="left">
                      <div id="object1">Score</div>
                      <div id="object2">Questions</div>
                    </div>

                    <div id="right">
                      <div id="object3">{obj_data4.score}</div>
                      <div id="object4">{obj_data4.questions}</div>
                    </div>
                  </div>
                </div>
                <div class="py-1 bd-highlight  subcomponent_header">
                  Details(Total)
                </div>
                <div class="py-1 bd-highlight  ">
                  <div id="content">
                    <div id="left">
                      <div id="object1">Score</div>
                      <div id="object2">Questions</div>
                      <div id="object2">Duration</div>
                      <div id="object2">Date</div>
                      {row.original.google_id ? (
                        <div id="object2">Login type :</div>
                      ) : (
                        ""
                      )}
                    </div>

                    <div id="right">
                      <div id="object3">{grand_total}</div>
                      <div id="object4">{tot_question_length}</div>
                      <div id="object4">{hh + ":" + mm + ":" + ss}</div>
                      <div id="object4">
                        {moment(data.created_at).format("DD-MM-YYYY")}
                      </div>
                      {row.original.google_id ? (
                        <div id="object4">
                          <img
                            width="20"
                            height="20"
                            src="https://img.icons8.com/fluency/48/google-logo.png"
                            alt="google-logo"
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <div class="py-1 bd-highlight  subcomponent_header">Action</div>
                <div class="py-1 bd-highlight ">
                  {" "}
                  <button
                    type="button"
                    class="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => {
                      handleShow(row);
                    }}
                  >
                    Show Answers
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="table-responsive bg-white p-3 rounded mb-3">
        <div
          className="d-flex justify-content-between align-items-center"
          id="datatable_header"
        >
          <div className="py-1">
            <select
              className="form-control border-secondary"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="py-1">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>
        <div className="pt-3">
          <table
            id="customers"
            {...getTableProps()}
            className="table table-bordered table-hover border border-1 rounded"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                      {/* <div>{column.canFilter ? column.render("Filter") : null}</div> */}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      <div>
                        {column.canFilter ? column.render("Filter") : null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.length == 0 ? (
                <tr>
                  <td className="text-center text-danger fw-bold" colSpan="9">
                    No Record Found
                  </td>
                </tr>
              ) : (
                ""
              )}
              {page.map((row) => {
                prepareRow(row);
                return (
                  <>
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                    {row.isExpanded && (
                      <tr>
                        <td colSpan={visibleColumns.length}>
                          {renderRowSubComponent(row)}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          <div
            className="d-flex justify-content-between align-items-center"
            id="datatable_header"
          >
            <div className="py-1">
              <span>
                Page {""}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center py-1">
              <button
                className="btn"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <i class="fa-solid fa-angles-left"></i>
              </button>
              <button
                className="btn"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <i class="fa-solid fa-angle-left"></i>
              </button>
              <span>
                <input
                  min="1"
                  className="form-control border-secondary"
                  style={{ display: "inline !important", width: "70px" }}
                  type="number"
                  defaultValue={pageIndex + 1}
                  onChange={(e) => {
                    const pageNumber = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    gotoPage(pageNumber);
                  }}
                  // style={{ width: "50px" }}
                />
              </span>
              <button
                className="btn"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <i class="fa-solid fa-angle-right"></i>
              </button>
              <button
                className="btn"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <i class="fa-solid fa-angles-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Modal --> */}
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Answers
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              {arr_value ? (
                <>
                  {section.map((e) => {
                    return (
                      <>
                        {JSON.parse(
                          JSON.stringify(
                            JSON.parse(JSON.parse(arr_value)[e]).questions
                          )
                        ) != "-" ? (
                          <div className="mb-3 bg-color rounded">
                            <h5 className="sections_tab p-2 rounded text-capitalize">
                              {
                                <div className="d-flex justify-content-start align-items-center">
                                  <div>
                                    {e.replace(/[^0-9](?=[0-9])/g, "$& ")}
                                  </div>

                                  <div class="mx-3 badge rounded-pill bg-dark">
                                    {JSON.parse(
                                      JSON.stringify(
                                        JSON.parse(JSON.parse(arr_value)[e])
                                          .questions
                                      )
                                    )}
                                  </div>
                                </div>
                              }
                            </h5>{" "}
                            <div className="p-3">
                              {JSON.parse(
                                JSON.stringify(
                                  JSON.parse(JSON.parse(arr_value)[e])
                                    .processed_answers
                                )
                              ).map((e, index) => {
                                return (
                                  <div className="px-3 py-2">
                                    <h6>
                                      {index + 1}. {e.question}
                                    </h6>
                                    {e.isCorrect ? (
                                      <button
                                        type="button"
                                        style={{ minWidth: "30%" }}
                                        className="selected_options p-1 m-1 rounded"
                                      >
                                        {e.correctAnswer}
                                      </button>
                                    ) : (
                                      <>
                                        <button
                                          type="button"
                                          style={{ minWidth: "30%" }}
                                          className="selected_options_danger p-1 m-1 rounded"
                                        >
                                          {e.wrongAnswer}
                                        </button>
                                        <button
                                          type="button"
                                          style={{ minWidth: "30%" }}
                                          className="selected_options p-1 m-1 rounded"
                                        >
                                          {e.correctAnswer}
                                        </button>
                                      </>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </>
                    );
                  })}
                </>
              ) : (
                ""
              )}
              <br />
            </div>
            {/* <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Save changes
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result_table;
