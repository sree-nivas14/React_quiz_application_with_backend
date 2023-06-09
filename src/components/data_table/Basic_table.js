import React, { useMemo } from "react";
import {
  useSortBy,
  useTable,
  useGlobalFilter,
  useFilters,
  usePagination,
  useBlockLayout,
  useResizeColumns,
} from "react-table";
import Mock_data from "./Mock_data.json";
import { COLUMNS } from "./column";
import "./Basic_table.css";
import GlobalFilter from "./GlobalFilter";
import { ToastContainer, toast } from "react-toastify";
import helpers from "../Services/Helper";

function Basic_table({ questions }) {
  // console.log(questions);
  function delete_questions() {
    let text = "Are u sure want to delete all the data?";
    if (window.confirm(text) == true) {
      document.getElementById("fp-container").style.visibility = "visible";
      helpers
        .delete_questions()
        .then((response) => {
          document.getElementById("fp-container").style.visibility = "hidden";
          toast(response.data, { type: "success" });
          window.location.reload(false);
        })
        .catch(function (error) {
          document.getElementById("fp-container").style.visibility = "hidden";
          alert(error.response.data.message);
        });
    }
  }

  function export_questions() {
    document.getElementById("fp-container").style.visibility = "visible";
    helpers
      .export_questions()
      .then((response) => {
        document.getElementById("fp-container").style.visibility = "hidden";
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Questions.xlsx"); //or any other extension
        document.body.appendChild(link);
        link.click();
        toast("Exported Successfully", {
          type: "success",
        });
      })
      .catch(function (error) {
        document.getElementById("fp-container").style.visibility = "hidden";
        alert(error.response.data.message);
      });
  }
  const columns = useMemo(() => COLUMNS, []);
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
                  <td className="text-center text-danger fw-bold" colSpan="4">
                    No Record Found
                  </td>
                </tr>
              ) : (
                ""
              )}
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
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
            <div className="py-1">
              <button
                type="button"
                className="btn btn-primary m-1"
                onClick={export_questions}
              >
                Export
              </button>
              <button
                type="button"
                className="btn btn-danger m-1"
                onClick={delete_questions}
              >
                Delete
              </button>
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
      <div
        className="fp-container"
        id="fp-container"
        style={{ visibility: "hidden" }}
      >
        <i
          className="fas fa-spinner fa-pulse fp-loader"
          style={{ fontSize: "70px" }}
        ></i>
      </div>
    </div>
  );
}

export default Basic_table;
