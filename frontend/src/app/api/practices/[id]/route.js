// src/app/api/practices/[id]/route.js

export async function GET(request, { params }) {
  const id = params.id;

  const practices = [
    {
      _id: '1',
      name: 'Test-Driven Development (TDD)',
      description: 'Writing tests before code to guide development.',
      evidences: ['TDD leads to better code quality', 'TDD reduces debugging time'],
    },
    {
      _id: '2',
      name: 'Continuous Integration',
      description: 'Frequently merging code changes to a shared repository.',
      evidences: ['CI reduces integration problems', 'CI improves code quality through automated testing'],
    },
    {
      _id: '3',
      name: 'Pair Programming',
      description: 'Two programmers working together at one workstation.',
      evidences: ['Pair programming improves code quality', 'Pair programming facilitates knowledge transfer'],
    },
    {
      _id: '4',
      name: 'Agile Development',
      description: 'Iterative approach to software development.',
      evidences: ['Agile increases customer satisfaction', 'Agile improves project visibility'],
    },
    {
      _id: '5',
      name: 'Code Reviews',
      description: 'Systematic examination of code by peers.',
      evidences: ['Code reviews catch bugs early', 'Code reviews improve code quality'],
    },
  ];

  const practice = practices.find(p => p._id === id);

  if (!practice) {
    return Response.json({ error: 'Practice not found' }, { status: 404 });
  }

  return Response.json({ data: practice });
}
