import Link from 'next/link'

const P5Art = ({ projects = [] }) => {
  const sorted = [...projects].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-10">
      <h1 className="text-white text-center text-5xl font-bold mb-10 drop-shadow-lg">
        p5.js Projects
      </h1>
      <div className="max-w-[1400px] mx-auto grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {sorted.map((project) => {
          const dateObj = new Date(project.date)
          dateObj.setDate(dateObj.getDate() + 1)
          const dateStr = dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
          return (
            <Link
              key={project.id}
              href={`/p5art/${project.id}`}
              className="block bg-white rounded-xl p-6 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all no-underline"
            >
              <div className="text-[#667eea] text-xl font-semibold mb-3 flex items-center gap-2">
                {project.emoji && <span className="text-2xl">{project.emoji}</span>}
                <span>{project.name}</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                {Array.isArray(project.description)
                  ? project.description.join(' ')
                  : project.description}
              </p>
              <p className="text-gray-400 text-xs mt-2">{dateStr}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default P5Art
