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

  return (
    <>
      <div>
        {/* <pre>
          <code>{JSON.stringify(state[0].filters, null, 2)}</code>
        </pre> */}
      </div>
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
            (row, i) =>
              prepareRow(row) || (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
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
      }
    ],
    []
  )

  return (
    <Section>
      <Styles>
        <Table columns={columns} data={assets} />
      </Styles>
      <Shape src="/static/shapes/shape-main-2.svg" className="shape-accent-2" alt="Shape svg" />
    </Section>
  )
}

const Section = styled.section`
  position: relative;
  padding-top: 90px;
  border-top: 1px solid #eaecee;
  padding-bottom: 90px;
  margin-bottom: 120px;
  overflow-y: hidden;
  overflow-x: hidden;
  min-height: 600px;

  @media (max-width: 760px) {
    padding-top: 40px;
  }

  @media (max-width: 1120px) {
    padding-top: 50px;
  }
`;

const Shape = styled.img`
  position: absolute;
  bottom: 0px;
  left: 70vw;
  z-index: -100;
  @media (max-width: 1120px) {
    bottom: 100px;
    left: 36vw;
  }
  @media (max-width: 760px) {
    display: none;
  }
`;

const Styles = styled.div`
  margin: 4rem;
  overflow: auto;
  background: #fff;

  table {
    border-spacing: 0;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
      :nth-child(odd) {
        background: rgba(0,0,0,.05);
      }
    }

    th {
      background: rgba(0,0,0,.1);
      text-align: left;
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem 1rem;
      min-width: 130px;
    }
  }
`

export default List;
