import fs from 'node:fs'
import { parse } from 'csv'
import { title } from 'node:process';

let isFirstRow = true;

const csvPath = new URL('../data.csv', import.meta.url)

fs.createReadStream(csvPath)
  .pipe(parse())
  .on('data', (row) => {
    if (isFirstRow) {
      isFirstRow = false
      return
    }

    const task = {
      title: row[0],
      description: row[1],
    }

    fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(error => {
        console.error(error)
      })
  })
  .on('end', () => {
    console.log('CSV file successfully processed')
  })