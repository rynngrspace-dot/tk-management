// SAW calculation logic — supports weekly assessments
export const calculateSAW = (students, criteria, assessments, week = null) => {
  // Filter by week if provided, otherwise use latest week
  let filteredAssessments = assessments;
  if (week) {
    filteredAssessments = assessments.filter(a => a.week === week);
  } else {
    // Auto-detect: if assessments have weeks, use the latest
    const weeks = [...new Set(assessments.map(a => a.week).filter(Boolean))].sort();
    if (weeks.length > 0) {
      filteredAssessments = assessments.filter(a => a.week === weeks[weeks.length - 1]);
    }
  }

  // Check if no data
  if (!students.length || !criteria.length || !filteredAssessments.length) return [];

  // Step 1: Find Max (Benefit) & Min (Cost) logic. All TK criteria are assumed Benefit (100 is best)
  const maxValues = {};
  criteria.forEach((c) => {
    maxValues[c.id] = Math.max(...filteredAssessments.map((a) => a.scores[c.id] || 0));
  });

  // Step 2: Normalize
  const normalized = filteredAssessments.map((a) => {
    const normScores = {};
    criteria.forEach((c) => {
      const val = a.scores[c.id] || 0;
      // Formula for Benefit: value / max
      normScores[c.id] = maxValues[c.id] > 0 ? val / maxValues[c.id] : 0;
    });
    return { studentId: a.studentId, normScores };
  });

  // Step 3: Multiply by weights & Sum
  const results = normalized.map((n) => {
    let finalScore = 0;
    criteria.forEach((c) => {
      finalScore += n.normScores[c.id] * c.weight;
    });
    // Add student details
    const student = students.find((s) => s.id === n.studentId);
    return {
      studentId: n.studentId,
      name: student ? student.name : "Unknown",
      nis: student ? student.nis : "-",
      classId: student ? student.classId : "-",
      score: Number((finalScore * 100).toFixed(2)), // Scaling back to 100 for display
    };
  });

  // Step 4: Sort (Rank)
  results.sort((a, b) => b.score - a.score);

  // Add rank relative to sort array
  results.forEach((r, idx) => (r.rank = idx + 1));

  return results;
};
