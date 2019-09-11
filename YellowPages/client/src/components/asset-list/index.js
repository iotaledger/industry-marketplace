import React from 'react'
import styled from 'styled-components'
import { useTable, useFilters, usePagination } from 'react-table'
import matchSorter from 'match-sorter'

// Define a default UI for filtering
function DefaultColumnFilter({ filterValue, setFilter }) {
  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder="Search..."
    />
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({ filterValue, setFilter, preFilteredRows, id }) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(
    () => {
      const options = new Set()
      preFilteredRows.forEach(row => {
        options.add(row.values[id])
      })
      return [...options.values()]
    },
    [id]
  )

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {[...options.values()].map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({ filterValue = [], setFilter }) {
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <input
        value={filterValue[0] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
        }}
        placeholder="Min"
        style={{
          width: '70px',
          marginRight: '0.5rem',
        }}
      />
      to
      <input
        value={filterValue[1] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
        }}
        placeholder="Max"
        style={{
          width: '70px',
          marginLeft: '0.5rem',
        }}
      />
    </div>
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

// Our table component
function Table({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters,
    usePagination
  )

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 20)

  const messageContent = cell => {
    return (
      <pre className="prettyprint lang-json">
        <code className="json prettyprint lang-json">
          {cell.render('Cell')}
        </code>
      </pre>
    )
  }

  return (
    <>
      {/* <div>
        <pre>
          <code>{JSON.stringify(state[0].filters, null, 2)}</code>
        </pre>
      </div> */}
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {firstPageRows.map(
            row =>
              prepareRow(row) || (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, i) =>
                    <td 
                      {...cell.getCellProps()}
                      className={i === row.cells.length - 1 ? 'expandable' : ''}
                    >
                      {
                        i === row.cells.length - 1
                        ? messageContent(cell)
                        : cell.render('Cell')
                      }
                    </td>
                  )}
                </tr>
              )
          )}
        </tbody>
      </table>
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
    </>
  )
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue >= filterValue
  })
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== 'number'

function List({ assets }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Operation",
        accessor: "operation",
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: "IRDI",
        accessor: "irdi",
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: "Sender",
        accessor: "sender",
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: "Receiver",
        accessor: "receiver",
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: "Price",
        accessor: "price",
        Filter: NumberRangeColumnFilter,
        filter: 'between',
      },
      {
        Header: "Location",
        accessor: "location",
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: "Start Time",
        accessor: "startTime"
      },
      {
        Header: "End Time",
        accessor: "endTime",
      },
      {
        Header: "Status",
        accessor: "type",
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: "Content",
        accessor: "originalMessage",
      }
    ],
    []
  )

  return (
    <Section>
      <Styles>
        <Table columns={columns} data={assets} />
      </Styles>
    </Section>
  )
}

const Section = styled.section`
  position: relative;
  min-height: 344px;
  max-width: 970px;
  width: 100%;
  margin: 100px 0;

  @media (max-width: 1000px) {
    max-width: 90vw;
  }
`;

const Styles = styled.div`
  overflow: auto;
  background: #fff;
  padding: 20px;

  table {
    border-spacing: 0;

    thead {
      border-bottom: 1px solid #485776;
    }

    tr {
      td {
        &:first-child {
          font-weight: bold;
        }
      }
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th {
      font-weight: 600;
      font-size: 14px;
      line-height: 17px;
      text-transform: uppercase;
      color: #485776;

      > div {
        margin-top: 10px;

        select, input {
          background: #EEF2FA;
          border-radius: 6px;
          height: 32px;
          font-size: 14px;
          line-height: 17px;
          color: #485776;
          border: none;
        }

        input {
          padding-left: 10px;

          &::placeholder {
            color: #485776;
            font-size: 14px;
            line-height: 17px;
          }
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem 1rem;
      min-width: 130px;
      vertical-align: top;
    }

    td.expandable {
      cursor: pointer;
      height: 60px;
      width: 300px;
      float: left;
      position: relative;
      transition: height 0.2s;
      -webkit-transition: height 0.2s;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:hover {
        height: 100%;
        white-space: unset;
      }
    }
  }
`

export default List;
