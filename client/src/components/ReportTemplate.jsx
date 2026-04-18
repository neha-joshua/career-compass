// Hidden template used for PDF generation
export default function ReportTemplate({ user, recommendations, assessment, id }) {
  const top5 = recommendations.slice(0, 5);
  const topCareer = top5[0];

  return (
    <div
      id={id}
      style={{
        width: '794px',
        minHeight: '1123px',
        backgroundColor: '#ffffff',
        fontFamily: "'Segoe UI', Arial, sans-serif",
        padding: '48px',
        boxSizing: 'border-box',
        position: 'absolute',
        left: '-9999px',
        top: 0,
      }}
    >
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', borderRadius: '16px', padding: '32px', marginBottom: '32px', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.7, marginBottom: '8px' }}>
              🧭 CareerCompass
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, marginBottom: '6px' }}>Career Assessment Report</h1>
            <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>Personalized Career Path Analysis</p>
          </div>
          <div style={{ textAlign: 'right', opacity: 0.8, fontSize: '12px' }}>
            <p style={{ margin: 0 }}>Generated on</p>
            <p style={{ margin: 0, fontWeight: 700 }}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Student Profile */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, marginBottom: '12px' }}>Student Profile</h3>
          <p style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, marginBottom: '4px' }}>{user?.name}</p>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{user?.email}</p>
        </div>
        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, marginBottom: '12px' }}>Academic Background</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { label: 'Stream', value: assessment?.stream || 'N/A' },
              { label: 'Current Grade', value: assessment?.current_grade ? `${assessment.current_grade}%` : 'N/A' },
              { label: 'Class 10', value: assessment?.grade_10 ? `${assessment.grade_10}%` : 'N/A' },
              { label: 'Class 12', value: assessment?.grade_12 ? `${assessment.grade_12}%` : 'N/A' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, margin: 0 }}>{label}</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Career Highlight */}
      {topCareer && (
        <div style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '20px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '40px' }}>{topCareer.career.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>⭐ Best Match Career</p>
              <p style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{topCareer.career.name}</p>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{topCareer.career.field} • {topCareer.career.salary_range}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '36px', fontWeight: 900, color: '#059669', margin: 0, lineHeight: 1 }}>{topCareer.score}%</p>
              <p style={{ fontSize: '11px', color: '#059669', fontWeight: 600, margin: 0 }}>Match Score</p>
            </div>
          </div>
        </div>
      )}

      {/* Top 5 Recommendations */}
      <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '14px', paddingBottom: '8px', borderBottom: '2px solid #e2e8f0' }}>
        Top Career Recommendations
      </h2>
      <div style={{ marginBottom: '28px' }}>
        {top5.map((rec, i) => (
          <div key={rec.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', borderRadius: '10px', marginBottom: '8px', background: i === 0 ? '#f0fdf4' : '#f8fafc', border: `1px solid ${i === 0 ? '#bbf7d0' : '#e2e8f0'}` }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: i === 0 ? '#22c55e' : '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '14px', flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontSize: '22px', flexShrink: 0 }}>{rec.career.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontSize: '14px' }}>{rec.career.name}</p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{rec.career.field} • Growth: {rec.career.growth_outlook}</p>
            </div>
            {/* Score bar */}
            <div style={{ width: '120px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Match</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: i === 0 ? '#22c55e' : '#6366f1' }}>{rec.score}%</span>
              </div>
              <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${rec.score}%`, background: i === 0 ? '#22c55e' : '#6366f1', borderRadius: '99px' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills Gap */}
      {topCareer?.gap && (
        <>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '14px', paddingBottom: '8px', borderBottom: '2px solid #e2e8f0' }}>
            Skills Gap Analysis — {topCareer.career.name}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#059669', margin: '0 0 8px 0' }}>✅ Skills You Have ({topCareer.gap.matchedSkills.length})</p>
              {topCareer.gap.matchedSkills.map(s => (
                <div key={s} style={{ padding: '6px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', marginBottom: '5px', fontSize: '12px', fontWeight: 600, color: '#166534' }}>{s}</div>
              ))}
              {topCareer.gap.matchedSkills.length === 0 && <p style={{ fontSize: '12px', color: '#94a3b8' }}>No matching skills yet</p>}
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626', margin: '0 0 8px 0' }}>❌ Skills to Develop ({topCareer.gap.missingSkills.length})</p>
              {topCareer.gap.missingSkills.map(s => (
                <div key={s} style={{ padding: '6px 10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '5px', fontSize: '12px', fontWeight: 600, color: '#991b1b' }}>{s}</div>
              ))}
              {topCareer.gap.missingSkills.length === 0 && <p style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>🎉 You have all required skills!</p>}
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Generated by CareerCompass – Smart Career Path Recommendation System</p>
        <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Confidential — For personal use only</p>
      </div>
    </div>
  );
}
