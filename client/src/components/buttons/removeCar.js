import React from 'react'
import { useMutation } from '@apollo/client'
import { filter } from 'lodash'
import { DeleteOutlined } from '@ant-design/icons'
import { GET_CARS, REMOVE_CAR } from '../../queries'

const RemoveCar = ({ id, make, model, price, personId, year }) => {
  const [removeCar] = useMutation(REMOVE_CAR, {
    update(cache, { data: { removeCar } }) {
      const { cars } = cache.readQuery({ query: GET_CARS })
      cache.writeQuery({
        query: GET_CARS,
        data: {
          cars: filter(cars, c => {
            return c.id !== removeCar.id
          })
        }
      })
    }
  })

  const handleButtonClick = () => {
    let result = window.confirm('Are you sure you want to delete this car?')

    if (result) {
      removeCar({
        variables: {
          id
        },
        optimisticResponse: {
          __typename: 'Mutation',
          removeCar: {
            __typename: 'Car',
            id,
            model,
            make,
            year,
            price,
            personId
          }
        }
      })
    }
  }

  return <DeleteOutlined key='delete' onClick={handleButtonClick} style={{ color: 'red' }} />
}

export default RemoveCar