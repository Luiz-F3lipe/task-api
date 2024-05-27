import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title | !description) {
        return res.writeHead(400).end('body must have title and description')
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      database.insert('tasks', task);

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title | !description) {
        return res.writeHead(400).end('body must have title and description')
      }

      const task = database.select('tasks', null, id);

      if (!task) {
        return res.writeHead(400).end('Task not found')
      }

      const updateTask = {
        ...task,
        title,
        description,
        updated_at: new Date(),
      }

      database.update('tasks', id, updateTask)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.select('tasks', null, id);

      if (!task) {
        return res.writeHead(400).end('Task not found')
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.select('tasks', null, id);

      if (!task) {
        return res.writeHead(400).end('Task not found')
      }

      const updateTask = {
        ...task,
        completed_at: task.completed_at ? null : new Date(),
        updated_at: new Date(),
      }

      database.update('tasks', id, updateTask)

      return res.writeHead(204).end()
    }
  }
]