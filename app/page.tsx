import ExpenseForm from './components/ExpenseForm'

export default function Home() {
  return (
    <main className="m-8 flex flex-col items-center justify-center h-screen">
      {/* Add blue block to background */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-sky-100 -z-50"></div>
      <h1 className="w-full max-w-screen-md mx-auto text-3xl font-black self-start">
        Spent This Much
      </h1>
      <div className="mt-8 pt-10 pb-10 w-full max-w-screen-md mx-auto flex items-center justify-between bg-sky-900 text-white p-4 rounded-md mb-2">
        <p className="text-lg font-semibold pl-2">Total Expenses Today</p>
        <span className="mx-2">|</span>
        <p className="text-2xl pr-2">10 €</p>
      </div>
      <ExpenseForm />
    </main>
  )
}
