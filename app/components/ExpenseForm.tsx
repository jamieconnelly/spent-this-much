'use client'
import { clsx } from 'clsx'
import React, { FormEvent } from 'react'

enum Category {
  FOOD_SHOP = 'FOOD_SHOP',
  EATING_OUT = 'EATING_OUT',
  SHOPPING = 'SHOPPING',
  RENT = 'RENT',
  WATER = 'WATER',
  ELECTRIC = 'ELECTRIC',
  INTERNET = 'INTERNET',
  OTHER = 'OTHER',
}

type FormValues = {
  date: string
  price: string
  category: Category | null
}

type Errors = Partial<{
  date: string | null
  price: string | null
  category: string | null
}>

type UpdateDate = { type: 'updateDate'; value: string }
type UpdatePrice = { type: 'updatePrice'; value: string }
type UpdateCategory = { type: 'updateCategory'; value: Category }
type Actions = UpdateDate | UpdatePrice | UpdateCategory

const reducer = (state: FormValues, action: Actions): FormValues => {
  if (action.type === 'updateDate') {
    return {
      ...state,
      date: action.value,
    }
  } else if (action.type == 'updatePrice') {
    return {
      ...state,
      price: action.value,
    }
  } else if (action.type == 'updateCategory') {
    return {
      ...state,
      category: action.value,
    }
  } else {
    return state
  }
}

const getInitFormValues = () => {
  const today = new Date()
  const formattedDate = today.toISOString().slice(0, 10)
  return {
    date: formattedDate,
    price: '',
    category: null,
  }
}

const ErrorMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-2 text-rose-500 text-xs">{children}</div>
)

const ExpenseForm = () => {
  const [formState, dispatch] = React.useReducer(reducer, {}, getInitFormValues)
  const [errors, setErrors] = React.useState<Errors>({})
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const isValid = () => {
    let errors: Errors = {}
    Object.keys(formState).forEach((key) => {
      const value = formState[key as keyof FormValues]
      if (key === 'date' && value === '') {
        errors.date = 'Select a date'
      } else if (key === 'price' && value === '') {
        errors.price = 'Set the price amount'
      } else if (key === 'category' && !value) {
        errors.category = 'Select a category'
      }
    })
    setErrors(errors)
    const hasErrors = !!Object.keys(errors).length
    return !hasErrors
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isValid()) {
      return
    }

    setIsSubmitting(true)
    const response = await fetch('/api/expense', {
      method: 'POST',
      body: JSON.stringify(formState),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    setIsSubmitting(false)
  }

  const handleOnChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters, leading zeros and round to 2 decimal points
    let value = event.target.value
      .replace(/[^\d.]/g, '')
      .replace(/^0+/, '')
      .replace(/^(\d+\.\d{0,2}).*$/, '$1')

    dispatch({
      type: 'updatePrice',
      value,
    })
  }

  const categories = [
    { name: 'Food shop', value: Category.FOOD_SHOP },
    { name: 'Eating out', value: Category.EATING_OUT },
    { name: 'Shopping', value: Category.SHOPPING },
    { name: 'Rent', value: Category.RENT },
    { name: 'Water', value: Category.WATER },
    { name: 'Electric', value: Category.ELECTRIC },
    { name: 'Internet', value: Category.INTERNET },
    { name: 'Other', value: Category.OTHER },
  ]

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-screen-md mx-auto p-4 bg-neutral-100 rounded-md drop-shadow-2xl"
    >
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium leading-6" />
        <span className="text-gray-700">Date</span>
        <input
          name="date"
          type="date"
          value={formState.date}
          onChange={(e) =>
            dispatch({ type: 'updateDate', value: e.target.value })
          }
          className="block w-full rounded-md border-0 py-1.5 pl-2 pr-2 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        {errors?.date && <ErrorMessage>{errors.date}</ErrorMessage>}
      </div>

      <div className="mb-4">
        <label
          htmlFor="price"
          className="block text-sm font-medium leading-6"
        />
        <span className="text-gray-700">Price</span>
        <div className="relative mt-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="sm:text-sm">€</span>
          </div>
          <input
            name="price"
            type="text"
            inputMode="decimal"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-2 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={handleOnChangePrice}
            value={formState.price}
          />
        </div>
        {errors?.price && <ErrorMessage>{errors.price}</ErrorMessage>}
      </div>

      <div className="mb-4">
        <span className="text-gray-700">Category</span>
        <div className="mt-2 grid grid-cols-3 gap-4">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={(e) => {
                e.preventDefault()
                dispatch({ type: 'updateCategory', value: category.value })
              }}
              className={clsx(
                'h-full w-full text-left p-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue ring-1 ring-inset ring-gray-300',
                {
                  'bg-white': formState.category !== category.value,
                  'bg-sky-800 text-white':
                    formState.category === category.value,
                }
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
        {errors?.category && <ErrorMessage>{errors.category}</ErrorMessage>}
      </div>

      {isSubmitting ? (
        <button
          type="button"
          className="flex justify-center w-full bg-teal-700 hover:bg-teal-600 cursor-not-allowed text-white py-2 px-4 rounded-md"
          disabled
        >
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Submitting...
        </button>
      ) : (
        <button
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md"
        >
          Submit
        </button>
      )}
    </form>
  )
}

export default ExpenseForm
