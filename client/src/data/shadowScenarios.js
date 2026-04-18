// 5-question "Shadow a Professional" scenarios for each career
// Scoring: start at 50, each question: best choice +10, ok +5, poor -5
// Final thresholds: >=80 Excellent, 65-79 Good, 50-64 Mixed, <50 Warning

export const shadowScenarios = {
  'Software Engineer': {
    intro: "You're a Software Engineer at a fast-growing startup. The team ships code fast and client expectations are high.",
    questions: [
      {
        time: '9:00 AM',
        situation: 'Your manager assigns a critical bug that must be fixed before the 2 PM client demo. Where do you start?',
        options: [
          { letter: 'A', text: 'Dive straight into the code and start editing', impact: 0, feedback: 'Jumping in without context often creates more bugs.' },
          { letter: 'B', text: 'Read the bug report and reproduce the issue first', impact: 10, feedback: 'Smart! Reproducing the bug ensures you fix the right thing.' },
          { letter: 'C', text: 'Ask a colleague to take it — you have other tasks', impact: -5, feedback: 'Avoiding ownership can stall the team when time is tight.' },
        ]
      },
      {
        time: '10:30 AM',
        situation: "You've isolated the bug, but the fix touches 3 modules. A quick patch could work but might break something else later.",
        options: [
          { letter: 'A', text: 'Apply the quick patch — demo is in 3.5 hours', impact: 5, feedback: 'Pragmatic, but tech debt is a real cost to manage.' },
          { letter: 'B', text: 'Fix all 3 modules properly even if it takes longer', impact: 10, feedback: 'Excellent engineering discipline. Quality matters.' },
          { letter: 'C', text: 'Tell the manager it cannot be fixed today', impact: -5, feedback: 'Giving up too early without exploring options is a red flag.' },
        ]
      },
      {
        time: '12:30 PM',
        situation: "Fix is done but it needs a code review. Your usual reviewer is in back-to-back meetings until 1:50 PM.",
        options: [
          { letter: 'A', text: 'Deploy to production without review to save time', impact: -5, feedback: 'Skipping reviews is how critical outages happen.' },
          { letter: 'B', text: 'Ping another team member for a 10-minute review', impact: 10, feedback: 'Resourceful! Good engineers unblock themselves.' },
          { letter: 'C', text: 'Wait for your usual reviewer and hope the demo uses staging', impact: 5, feedback: 'Safe, but slightly passive. Communication would help here.' },
        ]
      },
      {
        time: '1:45 PM',
        situation: 'Code review reveals 2 minor issues. 15 minutes to demo. Your manager wants to know the status.',
        options: [
          { letter: 'A', text: 'Fix both issues and update manager transparently', impact: 10, feedback: 'Perfect. Clear communication + action is what great engineers do.' },
          { letter: 'B', text: 'Fix one, accept the other as low-risk, inform manager', impact: 5, feedback: 'Reasonable judgement call under pressure.' },
          { letter: 'C', text: 'Ignore both and push — the manager is stressed already', impact: -5, feedback: 'Hiding issues before a demo can lead to embarrassing failures.' },
        ]
      },
      {
        time: '4:00 PM',
        situation: "Demo was a success! The client loved it. Now you have 3 new feature requests sitting in your inbox.",
        options: [
          { letter: 'A', text: 'Reply immediately promising all 3 by end of week', impact: -5, feedback: 'Over-promising leads to burnout and missed deadlines.' },
          { letter: 'B', text: 'Prioritize by impact, estimate timelines, reply tomorrow', impact: 10, feedback: 'Excellent! Thoughtful engineers manage expectations well.' },
          { letter: 'C', text: 'Forward to your manager and disengage — your job was the bug', impact: 5, feedback: 'Passing it up is okay but staying engaged adds more value.' },
        ]
      }
    ]
  },

  'Data Scientist': {
    intro: "You're a Data Scientist at an e-commerce company. You work with messy real-world data and leadership wants insights fast.",
    questions: [
      {
        time: '9:00 AM',
        situation: 'You receive a dataset with 40% missing values in the most important column. The model is due by Friday.',
        options: [
          { letter: 'A', text: 'Delete rows with missing values and proceed', impact: 0, feedback: 'Quick but risky — you lose 40% of your data and could bias results.' },
          { letter: 'B', text: 'Investigate why data is missing before deciding on imputation', impact: 10, feedback: 'Brilliant! Understanding missingness patterns is critical to good modeling.' },
          { letter: 'C', text: 'Impute with the column mean immediately and move on', impact: 5, feedback: 'Acceptable but may hide patterns. Investigation first is better.' },
        ]
      },
      {
        time: '11:00 AM',
        situation: "Your model shows 98% accuracy on training data but 61% on the test set. The CEO wants a demo tomorrow.",
        options: [
          { letter: 'A', text: 'Present the 98% number — it looks impressive', impact: -5, feedback: 'Presenting a misleading metric destroys trust when the model fails in production.' },
          { letter: 'B', text: 'Diagnose the overfitting and apply regularization', impact: 10, feedback: 'Correct! Overfitting is a real problem. Fix it before presenting.' },
          { letter: 'C', text: 'Email the CEO asking for a 2-day extension to fix the model', impact: 5, feedback: 'Honest and reasonable — integrity in data science is paramount.' },
        ]
      },
      {
        time: '1:00 PM',
        situation: "A stakeholder asks you to change which variables are included to make the model favor a specific product line.",
        options: [
          { letter: 'A', text: "Comply — they're the business owner and it's their call", impact: -5, feedback: 'Biasing models for business convenience is unethical and dangerous.' },
          { letter: 'B', text: 'Explain the implications and suggest a separate analysis instead', impact: 10, feedback: 'Perfect. Data scientists must protect model integrity while being helpful.' },
          { letter: 'C', text: 'Ignore the request and submit the original model quietly', impact: 5, feedback: 'Avoids bias, but not communicating creates tension. A conversation is better.' },
        ]
      },
      {
        time: '3:00 PM',
        situation: "You find a correlation that could be a major insight — but you only have 120 rows of data to support it.",
        options: [
          { letter: 'A', text: 'Report it as a confirmed finding in your slide deck', impact: -5, feedback: 'Overstating findings with weak evidence misleads decision-makers.' },
          { letter: 'B', text: "Flag it as a preliminary signal that needs more data", impact: 10, feedback: 'Excellent scientific integrity! Qualified findings are trustworthy findings.' },
          { letter: 'C', text: 'Ignore the correlation entirely — too small a sample', impact: 5, feedback: 'Conservative but wastes potentially valuable signal.' },
        ]
      },
      {
        time: '5:00 PM',
        situation: 'Your model is deployed. Two weeks later it starts making wrong predictions. What do you do?',
        options: [
          { letter: 'A', text: 'Blame the engineering team for deployment issues', impact: -5, feedback: 'Blame culture achieves nothing. Models degrade — it is your responsibility to monitor.' },
          { letter: 'B', text: 'Investigate data drift and model decay systematically', impact: 10, feedback: 'Pro move! Production monitoring is as important as model building.' },
          { letter: 'C', text: 'Retrain on new data quickly and redeploy', impact: 5, feedback: 'Reasonable, but understanding why it failed is important before retraining.' },
        ]
      }
    ]
  },

  'Doctor / Physician': {
    intro: "You're a first-year resident physician at a busy urban hospital. Long hours and high-pressure decisions are the norm.",
    questions: [
      {
        time: '7:00 AM',
        situation: "During morning rounds, a patient reports new chest pain that wasn't in yesterday's notes.",
        options: [
          { letter: 'A', text: 'Note it down and continue rounds — you will circle back later', impact: -5, feedback: "Chest pain can deteriorate fast. Delaying assessment is risky." },
          { letter: 'B', text: 'Pause rounds to immediately examine the patient and order an ECG', impact: 10, feedback: 'Correct clinical instinct. Time-sensitive symptoms require immediate attention.' },
          { letter: 'C', text: 'Ask the nurse to monitor and inform you if it worsens', impact: 5, feedback: 'Better than ignoring, but a physician should directly assess chest pain.' },
        ]
      },
      {
        time: '10:00 AM',
        situation: "You are 80% confident in your diagnosis, but one senior doctor disagrees with your treatment plan.",
        options: [
          { letter: 'A', text: 'Immediately defer to the senior doctor without discussion', impact: 5, feedback: 'Respectful, but good medicine requires clinical dialogue, not blind deference.' },
          { letter: 'B', text: 'Respectfully present your reasoning and ask for their thoughts', impact: 10, feedback: 'Excellent. Constructive clinical debate leads to better patient outcomes.' },
          { letter: 'C', text: 'Go ahead with your plan without informing the senior', impact: -5, feedback: 'Bypassing seniors in a team environment is dangerous and unprofessional.' },
        ]
      },
      {
        time: '1:00 PM',
        situation: "A patient's family member is aggressive, demanding immediate discharge despite medical advice against it.",
        options: [
          { letter: 'A', text: 'Agree to discharge to avoid conflict', impact: -5, feedback: 'Patient safety must override social pressure. This could be dangerous.' },
          { letter: 'B', text: 'Calmly explain the medical risks and document the refusal', impact: 10, feedback: 'Textbook response. Empathy + documentation protects both patient and physician.' },
          { letter: 'C', text: 'Escalate immediately to the hospital administrator', impact: 5, feedback: 'Appropriate in extreme cases, but direct communication should be the first step.' },
        ]
      },
      {
        time: '3:00 PM',
        situation: "You have been awake for 22 hours and feel fatigued. A nurse asks you to sign off on a medication dosage.",
        options: [
          { letter: 'A', text: 'Sign it — you trust the nurse and need to keep moving', impact: -5, feedback: 'Fatigue-induced errors are a top cause of medical mistakes. Always verify.' },
          { letter: 'B', text: 'Take 30 seconds to double-check the dosage before signing', impact: 10, feedback: 'This habit saves lives. Verification is non-negotiable.' },
          { letter: 'C', text: "Hand off to another resident — you're too tired to be safe", impact: 5, feedback: 'Self-awareness about limits is actually a sign of good clinical judgement.' },
        ]
      },
      {
        time: '6:00 PM',
        situation: "Your shift ended an hour ago, but a junior nurse is struggling with a complicated case and asks for help.",
        options: [
          { letter: 'A', text: 'Leave — your shift is over and you need rest', impact: 5, feedback: 'Rest is important. But briefly helping is part of team culture in medicine.' },
          { letter: 'B', text: 'Spend 10 minutes guiding the nurse through the case', impact: 10, feedback: 'Teaching and supporting colleagues is what builds great medical teams.' },
          { letter: 'C', text: 'Tell them to call the on-call doctor', impact: 5, feedback: 'Correct protocol, but a brief moment of mentorship goes a long way.' },
        ]
      }
    ]
  },

  'Lawyer / Advocate': {
    intro: "You're an associate at a busy law firm. Client cases, research, and court appearances fill every day.",
    questions: [
      {
        time: '9:00 AM',
        situation: 'A client calls in a panic — they missed a legal deadline. Can you fix it?',
        options: [
          { letter: 'A', text: 'Reassure them it will be fine without checking the case', impact: -5, feedback: 'False reassurance is unprofessional and potentially harmful.' },
          { letter: 'B', text: 'Pull the case file, check if an extension is possible, then call back', impact: 10, feedback: 'Proper! Research before advising is core to legal professionalism.' },
          { letter: 'C', text: 'Tell them to hire another lawyer', impact: -5, feedback: 'Abandoning a client without exploring options is a breach of duty.' },
        ]
      },
      {
        time: '11:00 AM',
        situation: 'During research, you find a precedent that weakens your own case. The hearing is in 2 days.',
        options: [
          { letter: 'A', text: 'Ignore the precedent and hope the opposing counsel misses it', impact: -5, feedback: "They won't miss it. Ignoring adverse law destroys credibility in court." },
          { letter: 'B', text: 'Distinguish the precedent and build an argument around it', impact: 10, feedback: 'This is lawyering. Distinguishing adverse cases is a core skill.' },
          { letter: 'C', text: 'Advise the client to settle before the hearing', impact: 5, feedback: 'Reasonable option, but explore all arguments first.' },
        ]
      },
      {
        time: '1:00 PM',
        situation: 'A client asks you to help hide financial records that are relevant to the case.',
        options: [
          { letter: 'A', text: 'Help them — client loyalty is everything', impact: -5, feedback: 'This is obstruction of justice. Your license would be at risk.' },
          { letter: 'B', text: 'Firmly refuse and explain the legal consequences of evidence tampering', impact: 10, feedback: 'Correct. Ethics over loyalty — always.' },
          { letter: 'C', text: 'Pretend you did not hear that and continue the meeting', impact: -5, feedback: 'Ignoring this makes you complicit. You must address it directly.' },
        ]
      },
      {
        time: '3:00 PM',
        situation: "You're in court and the judge asks a question you don't know the answer to.",
        options: [
          { letter: 'A', text: "Make up a plausible-sounding answer", impact: -5, feedback: "Misleading a court is perjury. Never guess in front of a judge." },
          { letter: 'B', text: 'Honestly say you will confirm and submit within 24 hours', impact: 10, feedback: "Judges respect honesty. 'I'll confirm' is always acceptable." },
          { letter: 'C', text: 'Redirect to a related point you do know well', impact: 5, feedback: 'Artful deflection can work, but direct honesty is stronger.' },
        ]
      },
      {
        time: '5:00 PM',
        situation: 'Your firm partner asks you to bill 3 extra hours you did not actually work to meet client billing targets.',
        options: [
          { letter: 'A', text: 'Comply — the partner outranks you', impact: -5, feedback: 'Fraudulent billing can end your legal career. Always push back on unethical requests.' },
          { letter: 'B', text: 'Decline and document the conversation in writing', impact: 10, feedback: 'Excellent. Protecting yourself with documentation is essential.' },
          { letter: 'C', text: 'Billing the exact hours you worked', impact: 10, feedback: 'The only ethical option. Document everything.' },
        ]
      }
    ]
  },

  'Teacher / Educator': {
    intro: "You're a secondary school teacher. Every day brings different students, different challenges, and moments that matter.",
    questions: [
      {
        time: '8:00 AM',
        situation: 'One student has failed 3 consecutive tests despite appearing to pay attention in class.',
        options: [
          { letter: 'A', text: 'Mark them as a low performer and move on', impact: -5, feedback: 'Writing off students is a failure of teaching.' },
          { letter: 'B', text: 'Schedule a 1-on-1 conversation to understand the underlying issue', impact: 10, feedback: 'Exactly right. Often there are unseen challenges — academic, emotional, or social.' },
          { letter: 'C', text: 'Ask the parents to get a tutor', impact: 5, feedback: 'Parental involvement helps, but connecting directly with the student comes first.' },
        ]
      },
      {
        time: '10:00 AM',
        situation: "30% of the class didn't understand yesterday's concept. Your lesson plan moves forward today.",
        options: [
          { letter: 'A', text: 'Stick to the lesson plan — you cannot fall behind', impact: -5, feedback: "Building on a shaky foundation means the whole class struggles later." },
          { letter: 'B', text: 'Take 15 minutes to reteach the concept with a different approach', impact: 10, feedback: 'Good teaching adapts. Flexibility is a superpower in the classroom.' },
          { letter: 'C', text: 'Assign a reading and ask students to figure it out themselves', impact: 0, feedback: 'Passive — students who did not understand before will struggle with self-study.' },
        ]
      },
      {
        time: '12:00 PM',
        situation: 'A student challenges your explanation in front of the class. You believe you are correct.',
        options: [
          { letter: 'A', text: 'Shut down the challenge firmly to maintain class authority', impact: -5, feedback: "Silencing curiosity kills classroom culture." },
          { letter: 'B', text: 'Explore the challenge together and look it up if needed', impact: 10, feedback: "Perfect. Modeling intellectual curiosity is one of teaching's most powerful tools." },
          { letter: 'C', text: 'Ask the student to discuss it after class', impact: 5, feedback: 'Fair, but brief class engagement could benefit all students.' },
        ]
      },
      {
        time: '2:00 PM',
        situation: 'You notice two students bullying a third student between classes.',
        options: [
          { letter: 'A', text: 'Walk past — it was not in your classroom', impact: -5, feedback: "Teachers have a duty of care beyond the classroom walls." },
          { letter: 'B', text: 'Intervene immediately and report it through school channels', impact: 10, feedback: 'Correct. Intervening promptly and following protocol is the right call.' },
          { letter: 'C', text: 'Warn the bullies quietly without escalating', impact: 5, feedback: "Well-intentioned, but formal reporting protects everyone — especially the victim." },
        ]
      },
      {
        time: '4:00 PM',
        situation: 'A parent emails accusing you of favouritism in grading. Your grading was objective.',
        options: [
          { letter: 'A', text: 'Ignore the email — you know you were fair', impact: -5, feedback: 'Ignoring parent concerns creates unnecessary conflict.' },
          { letter: 'B', text: 'Reply calmly, explain your grading criteria and offer to meet', impact: 10, feedback: 'Professional and de-escalatory. Transparent grading builds trust.' },
          { letter: 'C', text: 'Adjust the grade to avoid conflict', impact: -5, feedback: "Compromising objective grading under social pressure is unfair to all students." },
        ]
      }
    ]
  },

  'Civil Engineer': {
    intro: "You're a junior site engineer on a large infrastructure project. Quality, safety and deadlines all compete for attention.",
    questions: [
      {
        time: '8:00 AM',
        situation: "A delivery of concrete arrives but test results show its strength is slightly below specification.",
        options: [
          { letter: 'A', text: 'Accept it — only slightly below spec and deadline is tight', impact: -5, feedback: 'Substandard materials in structural work can have catastrophic consequences.' },
          { letter: 'B', text: 'Reject the batch and notify the project manager immediately', impact: 10, feedback: 'Correct. Quality control is non-negotiable on safety-critical structures.' },
          { letter: 'C', text: 'Use it for non-structural areas only', impact: 5, feedback: 'Practical workaround, but the supplier should still be formally notified.' },
        ]
      },
      {
        time: '10:30 AM',
        situation: 'A construction worker points out a safety hazard that could cause an accident on site.',
        options: [
          { letter: 'A', text: 'Note it in your report for the weekly safety meeting', impact: -5, feedback: 'Deferring immediate hazards is dangerous. Fix it now.' },
          { letter: 'B', text: 'Stop work in that area, fix the hazard, then document it', impact: 10, feedback: 'Proper safety response. Worker lives come first.' },
          { letter: 'C', text: "Tell the worker to work around it carefully", impact: -5, feedback: 'Asking workers to work around known hazards is both dangerous and illegal.' },
        ]
      },
      {
        time: '1:00 PM',
        situation: "The client wants to change the structural drawing 3 weeks into construction. Your team says it will cause a 2-week delay.",
        options: [
          { letter: 'A', text: 'Implement the change immediately to keep the client happy', impact: -5, feedback: 'Change orders without impact assessment cause scope creep and budget overruns.' },
          { letter: 'B', text: 'Prepare a formal change order with cost and timeline impact', impact: 10, feedback: 'Textbook project management. Document everything.' },
          { letter: 'C', text: 'Tell the client the change is impossible at this stage', impact: 5, feedback: 'Honest, but a change order with options is more professional.' },
        ]
      },
      {
        time: '3:00 PM',
        situation: "You discover that a colleague falsified concrete pour records to hide a missed inspection.",
        options: [
          { letter: 'A', text: "Cover for them — they're a friend and it was minor", impact: -5, feedback: 'Falsified records on a structural project is a serious safety and legal issue.' },
          { letter: 'B', text: 'Report it to the project manager and suggest a proper inspection', impact: 10, feedback: 'Integrity over loyalty. This protects public safety.' },
          { letter: 'C', text: 'Confront the colleague privately and demand they self-report', impact: 5, feedback: 'A reasonable first step, but you must follow up formally if they refuse.' },
        ]
      },
      {
        time: '5:00 PM',
        situation: 'Budget estimates show the project will overspend by 8%. The project manager wants to cut quality checks.',
        options: [
          { letter: 'A', text: 'Agree — the PM has more authority', impact: -5, feedback: 'Quality inspections exist for safety. Cutting them is not a budget decision to make.' },
          { letter: 'B', text: 'Document your objection and propose cost savings elsewhere', impact: 10, feedback: 'Excellent. Engineering professionals have an ethical obligation to object.' },
          { letter: 'C', text: 'Do fewer quality checks without telling anyone', impact: -5, feedback: 'Silent non-compliance is still non-compliance — and creates liability.' },
        ]
      }
    ]
  },

  'Mechanical Engineer': {
    intro: "You're a mechanical engineer at an automotive components manufacturer. Precision, deadlines and team coordination matter every day.",
    questions: [
      {
        time: '8:30 AM',
        situation: 'A prototype component fails stress testing at 85% of the required load. Production is scheduled to begin next week.',
        options: [
          { letter: 'A', text: 'Approve the design anyway — 85% is close enough', impact: -5, feedback: 'Safety margins exist for real-world variance. 85% is a fail.' },
          { letter: 'B', text: 'Identify the failure mode and redesign before production starts', impact: 10, feedback: 'Correct engineering process. Never approve a component that fails specification.' },
          { letter: 'C', text: 'Recommend reducing the required load specification instead', impact: -5, feedback: 'Changing specs to match failures defeats the purpose of testing.' },
        ]
      },
      {
        time: '10:30 AM',
        situation: "A supplier proposes a cheaper material that meets 90% of spec requirements. Your manager is excited about the cost savings.",
        options: [
          { letter: 'A', text: 'Approve it to support the cost saving initiative', impact: -5, feedback: '90% spec compliance in mechanical parts can mean failures under real conditions.' },
          { letter: 'B', text: 'Run additional tests specifically targeting the 10% gap areas', impact: 10, feedback: 'Data-driven decision-making. Test the unknown before committing.' },
          { letter: 'C', text: 'Check where this part is used and assess risk before deciding', impact: 10, feedback: 'Risk-based thinking! The answer depends on application criticality.' },
        ]
      },
      {
        time: '12:00 PM',
        situation: "A manufacturing technician says a CNC machine is behaving oddly. Production output looks fine so far.",
        options: [
          { letter: 'A', text: "Ignore it — if output is fine, the machine is fine", impact: -5, feedback: "Early warning signs ignored become catastrophic failures." },
          { letter: 'B', text: 'Schedule a preventive maintenance check before the next shift', impact: 10, feedback: 'Proactive maintenance saves cost and prevents downtime. Excellent instinct.' },
          { letter: 'C', text: 'Ask the technician to monitor it and report if it gets worse', impact: 5, feedback: 'Monitoring is okay but scheduling a check sooner is better.' },
        ]
      },
      {
        time: '2:00 PM',
        situation: 'Your CAD model is complete but a senior engineer suggests a different design approach. You think yours is better.',
        options: [
          { letter: 'A', text: 'Defend your design and refuse to change it', impact: -5, feedback: 'Engineering is a collaborative field. Dismissing feedback creates team friction.' },
          { letter: 'B', text: 'Run comparative analysis on both designs and let data decide', impact: 10, feedback: 'Perfect. Evidence-based discussions move engineering teams forward.' },
          { letter: 'C', text: 'Defer to the senior engineer without analysis', impact: 5, feedback: 'Respectful but passive. Use the analysis to contribute to the decision.' },
        ]
      },
      {
        time: '4:00 PM',
        situation: 'A field report comes in — 3 units in the market have the same failure pattern. Thousands more are in use.',
        options: [
          { letter: 'A', text: 'Wait for more field data before acting', impact: -5, feedback: 'A repeated failure pattern in safety-critical components requires immediate action.' },
          { letter: 'B', text: 'Escalate immediately, start root cause analysis, prepare recall if needed', impact: 10, feedback: 'Correct crisis response. Acting fast protects users and limits liability.' },
          { letter: 'C', text: 'Issue a silent fix in the next production run only', impact: -5, feedback: 'Units already in the field are still at risk. This is insufficient.' },
        ]
      }
    ]
  },

  'Business Analyst': {
    intro: "You're a Business Analyst at a mid-size company. You bridge the gap between data, stakeholders, and technical teams.",
    questions: [
      {
        time: '9:00 AM',
        situation: 'A stakeholder sends you a requirement document that contradicts itself in two places.',
        options: [
          { letter: 'A', text: 'Pick the interpretation that seems most logical and proceed', impact: 5, feedback: 'Shows initiative, but ambiguous requirements cause costly rework.' },
          { letter: 'B', text: 'Request a clarification meeting before writing any specs', impact: 10, feedback: 'Right move. Ambiguity kills projects. Clarify early.' },
          { letter: 'C', text: 'Submit both interpretations as separate requirements', impact: 5, feedback: 'Thoughtful but doubles the scope. A clarification saves time.' },
        ]
      },
      {
        time: '11:00 AM',
        situation: "The development team says a requested feature will take 3 months. The stakeholder expected 2 weeks.",
        options: [
          { letter: 'A', text: "Tell the stakeholder '3 months' without context", impact: -5, feedback: 'Dropping bad news without context triggers frustration.' },
          { letter: 'B', text: 'Facilitate a discussion between dev and stakeholder to align scope and timeline', impact: 10, feedback: 'The BA role is exactly this — bridging expectations with reality.' },
          { letter: 'C', text: 'Ask the dev team to compress their timeline', impact: -5, feedback: 'Pressuring estimates without scope reduction usually leads to quality failures.' },
        ]
      },
      {
        time: '1:00 PM',
        situation: 'During UAT, a tester finds a bug that was in the original specification as a design choice (not a bug).',
        options: [
          { letter: 'A', text: 'Tell the tester they are wrong', impact: -5, feedback: "Dismissing feedback without investigation damages team trust." },
          { letter: 'B', text: 'Review the spec, explain the intent, and update documentation if needed', impact: 10, feedback: 'Clear documentation prevents repeated confusion. Address it properly.' },
          { letter: 'C', text: 'Fix it to match the tester expectations silently', impact: -5, feedback: "Changing design choices without stakeholder sign-off breaks traceability." },
        ]
      },
      {
        time: '3:00 PM',
        situation: 'Two departments have conflicting priorities for the same project resource. Both want their feature first.',
        options: [
          { letter: 'A', text: "Side with the higher-ranking department", impact: 0, feedback: 'Hierarchy is not the same as business priority. Analysis needed.' },
          { letter: 'B', text: 'Present a priority matrix with business impact data and escalate to leadership', impact: 10, feedback: 'Objective frameworks cut through politics. Use data to guide decisions.' },
          { letter: 'C', text: 'Tell both teams to work it out between themselves', impact: -5, feedback: 'Abdicating this responsibility is a failure of the BA role.' },
        ]
      },
      {
        time: '5:00 PM',
        situation: "You discover that a data report the CEO uses weekly has a calculation error. It has been wrong for 3 months.",
        options: [
          { letter: 'A', text: 'Fix it silently in the next report run', impact: -5, feedback: '3 months of wrong data means decisions were made on bad information. Leadership must know.' },
          { letter: 'B', text: 'Escalate immediately with context on what decisions may have been affected', impact: 10, feedback: 'Brave and correct. Transparency, even about bad news, is a professional obligation.' },
          { letter: 'C', text: 'Investigate who caused the error before reporting it', impact: 5, feedback: 'Some investigation is good, but delay to assign blame is the wrong priority.' },
        ]
      }
    ]
  },

  'Marketing Manager': {
    intro: "You're a Marketing Manager at a consumer brand. Campaigns, budgets, creativity and metrics are your daily reality.",
    questions: [
      {
        time: '9:00 AM',
        situation: "A campaign you launched last week has a 0.4% click-through rate against a 2% target. The CEO reviews it tomorrow.",
        options: [
          { letter: 'A', text: "Prepare a positive spin for the CEO's review", impact: -5, feedback: 'Spinning bad data damages credibility. Leaders need accurate information.' },
          { letter: 'B', text: 'Diagnose what went wrong and prepare an honest report with a revised plan', impact: 10, feedback: 'The mark of a good marketer. Fail fast, learn fast, pivot.' },
          { letter: 'C', text: 'Run more ads with the same creative to boost volume', impact: -5, feedback: 'Scaling a failing campaign amplifies losses.' },
        ]
      },
      {
        time: '11:00 AM',
        situation: "Your agency partner wants to increase the ad spend budget by 50%. You don't have data supporting this ROI.",
        options: [
          { letter: 'A', text: 'Approve it — agencies know best', impact: -5, feedback: "Approving budget without ROI data isn't marketing, it's guessing." },
          { letter: 'B', text: 'Request a small test-and-learn pilot before committing the full budget', impact: 10, feedback: 'Exactly right. Test, validate, then scale.' },
          { letter: 'C', text: 'Reject it entirely', impact: 5, feedback: 'Cautious, but a structured pilot might have unlocked real value.' },
        ]
      },
      {
        time: '1:00 PM',
        situation: "A competitor runs a controversial campaign that goes viral. Your team suggests copying the approach.",
        options: [
          { letter: 'A', text: 'Copy it immediately before the trend fades', impact: -5, feedback: "Following controversy without brand alignment can backfire badly." },
          { letter: 'B', text: "Evaluate whether it aligns with your brand's values before deciding", impact: 10, feedback: 'Brand consistency matters more than chasing viral moments.' },
          { letter: 'C', text: 'Post a competitor response campaign quickly', impact: 5, feedback: 'Reactive campaigns can work, but need to be brand-authentic first.' },
        ]
      },
      {
        time: '3:00 PM',
        situation: "Customer complaints about a product feature have spiked. Your campaign is still actively promoting that feature.",
        options: [
          { letter: 'A', text: 'Continue the campaign — product issues are not your department', impact: -5, feedback: 'Marketing a known pain point erodes trust rapidly.' },
          { letter: 'B', text: "Pause that campaign element and alert the product team immediately", impact: 10, feedback: 'Marketing and product must move together. Pausing shows good cross-functional instinct.' },
          { letter: 'C', text: 'Add a disclaimer to the campaign', impact: 5, feedback: 'Better than nothing, but pausing is a stronger response.' },
        ]
      },
      {
        time: '5:00 PM',
        situation: 'End of quarter: your team hit 85% of KPIs. Leadership expects a 100% next quarter. How do you respond?',
        options: [
          { letter: 'A', text: 'Commit to 100% without analyzing what drove the 15% gap', impact: -5, feedback: 'Arbitrary commitments without analysis set teams up to fail.' },
          { letter: 'B', text: 'Present a root cause breakdown and propose a realistic revised target with a clear action plan', impact: 10, feedback: 'Strategic marketers use data to set achievable targets and earn trust.' },
          { letter: 'C', text: "Tell leadership the targets were unrealistic to start with", impact: 5, feedback: 'Honest feedback is valuable — but pair it with a constructive plan forward.' },
        ]
      }
    ]
  },

  'Graphic Designer': {
    intro: "You're a Graphic Designer at a creative agency. Briefs, deadlines, revisions, and client taste are your daily challenge.",
    questions: [
      {
        time: '9:30 AM',
        situation: "A client brief is vague — it says 'make it pop' with no other direction. Presentation is in 3 days.",
        options: [
          { letter: 'A', text: 'Design what you think looks best and present it', impact: 5, feedback: 'Shows confidence, but risks missing the mark entirely.' },
          { letter: 'B', text: 'Send a brief questionnaire to clarify brand, audience, and tone before starting', impact: 10, feedback: 'Correct. Good design starts with understanding, not assumptions.' },
          { letter: 'C', text: 'Design 5 different directions and let the client pick', impact: 5, feedback: 'Generous, but a targeted brief produces better results with less wasted effort.' },
        ]
      },
      {
        time: '11:00 AM',
        situation: "Round 1 feedback: the client wants you to change the colour scheme, font, layout, and logo size. Essentially everything.",
        options: [
          { letter: 'A', text: 'Make all the changes — the client is always right', impact: 5, feedback: 'Accommodating, but extensive scope creep needs a conversation.' },
          { letter: 'B', text: "Discuss which changes align with the brief's goals before executing", impact: 10, feedback: 'Professional designers guide the client, not just execute instructions.' },
          { letter: 'C', text: 'Refuse changes that contradict your design vision', impact: -5, feedback: "Client work isn't personal art. Collaboration is the job." },
        ]
      },
      {
        time: '1:00 PM',
        situation: 'You find a stock image that is perfect for the design but you are unsure of its licensing status.',
        options: [
          { letter: 'A', text: "Use it — it's just a stock photo", impact: -5, feedback: 'Copyright violations can result in legal action against your agency.' },
          { letter: 'B', text: 'Verify the license or find a licensed alternative', impact: 10, feedback: 'Always verify. IP compliance is a professional responsibility.' },
          { letter: 'C', text: 'Use it but credit the photographer in small print', impact: -5, feedback: 'Attribution does not replace a proper license for commercial use.' },
        ]
      },
      {
        time: '3:00 PM',
        situation: "Your design looks great on screen but the client emails saying 'the colours look completely different in print'.",
        options: [
          { letter: 'A', text: "Blame the printer — your file is correct", impact: -5, feedback: 'CMYK vs RGB is a fundamental design responsibility, not a printer error.' },
          { letter: 'B', text: "Apologise, check if the file was set up in CMYK with correct print specs, and resend", impact: 10, feedback: 'Correct. Print setup is always the designer\'s responsibility to verify.' },
          { letter: 'C', text: 'Ask the client to use a different printer', impact: -5, feedback: 'This sidesteps the real issue — file preparation.' },
        ]
      },
      {
        time: '5:30 PM',
        situation: "A project you're proud of just got rejected entirely by the client. They want a completely different direction.",
        options: [
          { letter: 'A', text: 'Express frustration and tell them their taste is wrong', impact: -5, feedback: 'Client relationships matter more than ego. Stay professional.' },
          { letter: 'B', text: 'Ask for a call to understand their vision better and restart with that clarity', impact: 10, feedback: 'Resilience and curiosity over pride. This is how great designers grow.' },
          { letter: 'C', text: 'Reskin the same design with different colours', impact: -5, feedback: "A complete rejection needs a real pivot, not a cosmetic change." },
        ]
      }
    ]
  },

  'Journalist / Reporter': {
    intro: "You're a reporter at a news outlet. Speed, accuracy, and integrity define your daily work.",
    questions: [
      {
        time: '9:00 AM',
        situation: 'A source shares a major story but asks to remain anonymous. The story is unverified.',
        options: [
          { letter: 'A', text: 'Publish immediately — first to break the story wins', impact: -5, feedback: "Publishing unverified stories destroys credibility. One source isn't enough." },
          { letter: 'B', text: 'Seek independent corroboration from at least one other source before publishing', impact: 10, feedback: 'Correct journalism ethics. Verification before publication.' },
          { letter: 'C', text: 'Publish with a disclaimer that the story is unconfirmed', impact: 5, feedback: 'Better than nothing, but unverified claims still cause harm when published.' },
        ]
      },
      {
        time: '11:00 AM',
        situation: "A politician you're interviewing deflects every question. The interview is live in 5 minutes.",
        options: [
          { letter: 'A', text: 'Let it go — being confrontational looks bad on camera', impact: -5, feedback: 'Journalism is not PR. Asking difficult questions is the job.' },
          { letter: 'B', text: 'Calmly repeat specific direct questions and note the deflection for your audience', impact: 10, feedback: 'Outstanding. Persistent, calm, and transparent — the hallmark of good journalism.' },
          { letter: 'C', text: 'Change to softer questions to fill the time', impact: -5, feedback: 'Soft-pedalling powerful subjects is a disservice to your audience.' },
        ]
      },
      {
        time: '1:00 PM',
        situation: "An editor pressures you to change a key fact in your story to make the headline more dramatic.",
        options: [
          { letter: 'A', text: 'Comply — editors have final say', impact: -5, feedback: 'Altering facts at editorial pressure violates journalistic ethics.' },
          { letter: 'B', text: 'Refuse, cite the fact, and escalate if necessary', impact: 10, feedback: 'Integrity over career pressure. This is what separates good journalists.' },
          { letter: 'C', text: "Rewrite the headline to be dramatic but accurate", impact: 10, feedback: 'Creative solution that maintains integrity. Well done.' },
        ]
      },
      {
        time: '3:00 PM',
        situation: "Your story accidentally included a private citizen's personal phone number. It's already published.",
        options: [
          { letter: 'A', text: "Wait and see if anyone complains", impact: -5, feedback: 'This is a serious privacy violation. Act immediately.' },
          { letter: 'B', text: 'Remove the number immediately, issue a correction, and notify the person', impact: 10, feedback: 'Fast, responsible, and transparent. The correct response.' },
          { letter: 'C', text: 'Edit the article quietly without issuing a correction', impact: 5, feedback: 'Good to remove it, but silent edits without corrections damage credibility.' },
        ]
      },
      {
        time: '5:00 PM',
        situation: "A company whose PR team frequently gives you exclusives is involved in a corruption story. Do you report it?",
        options: [
          { letter: 'A', text: "Sit on the story to protect the relationship", impact: -5, feedback: 'Suppressing news for source relationships is a severe journalistic failure.' },
          { letter: 'B', text: 'Report the story objectively — journalism has no loyalty to sources', impact: 10, feedback: 'Correct. Independent journalism cannot be conditional.' },
          { letter: 'C', text: 'Tip off the company first to give them a chance to respond', impact: 5, feedback: 'Giving a subject the right to respond is good practice — but it must not suppress the story.' },
        ]
      }
    ]
  },

  'Architect': {
    intro: "You're a junior architect at a design firm. You balance creativity, client expectations, regulations, and engineering constraints.",
    questions: [
      {
        time: '9:00 AM',
        situation: "The client loves your concept design but a structural engineer says one element is not buildable as drawn.",
        options: [
          { letter: 'A', text: 'Defend the design — the engineer just needs to find a way', impact: -5, feedback: 'Architecture requires engineering collaboration. Ignoring structural reality is unprofessional.' },
          { letter: 'B', text: 'Work with the structural engineer to redesign the element while preserving the design intent', impact: 10, feedback: 'Exactly right. The best architecture solves both design and structural constraints together.' },
          { letter: 'C', text: "Tell the client the element needs to change without explaining why", impact: 5, feedback: 'Honest but incomplete. Clients deserve an explanation of constraints.' },
        ]
      },
      {
        time: '11:00 AM',
        situation: "Your design for a residential building will technically comply with zoning laws but will block sunlight to neighbouring homes.",
        options: [
          { letter: 'A', text: "It's legal — proceed with the design", impact: -5, feedback: 'Good architecture considers community impact beyond minimum code compliance.' },
          { letter: 'B', text: 'Revise the design to balance the client brief and community impact', impact: 10, feedback: 'Ethical architecture considers people beyond the project boundary.' },
          { letter: 'C', text: 'Inform the client of the issue and let them decide', impact: 5, feedback: 'Transparent — but actively proposing a better solution shows design leadership.' },
        ]
      },
      {
        time: '1:00 PM',
        situation: 'Midway through documentation, the client suddenly increases the budget and wants to add two new floors.',
        options: [
          { letter: 'A', text: 'Add the floors to the existing drawings quickly', impact: -5, feedback: 'Two new floors require structural, MEP, and fire safety re-evaluation. This is not a simple edit.' },
          { letter: 'B', text: 'Pause and reassess the entire project scope with the full consultant team', impact: 10, feedback: 'Correct. Vertical additions cascade into many building systems.' },
          { letter: 'C', text: 'Add the floors but note that consultants need to review', impact: 5, feedback: 'Reasonable interim step, but do not distribute those drawings before consultant sign-off.' },
        ]
      },
      {
        time: '3:00 PM',
        situation: 'A contractor asks if they can substitute a specified material for a cheaper alternative on site.',
        options: [
          { letter: 'A', text: "Approve it verbally to keep the project moving", impact: -5, feedback: 'Verbal approvals for material substitutions create liability issues. Always document.' },
          { letter: 'B', text: 'Review the substitute specifications and issue a formal written approval or rejection', impact: 10, feedback: 'Correct process. Every substitution must be formally evaluated and documented.' },
          { letter: 'C', text: 'Tell the contractor to ask the client directly', impact: -5, feedback: 'Material approvals are the architect of record responsibility, not the client.' },
        ]
      },
      {
        time: '5:00 PM',
        situation: "You discover your firm's project partner took credit for your design in a client presentation without mentioning you.",
        options: [
          { letter: 'A', text: 'Say nothing — it is not worth the conflict', impact: -5, feedback: 'Unchecked credit-taking affects your career progression and morale.' },
          { letter: 'B', text: 'Speak with the partner privately and calmly raise the issue', impact: 10, feedback: 'Professional and direct. Attribution matters in creative careers.' },
          { letter: 'C', text: 'Complain to colleagues about it', impact: -5, feedback: 'Venting without direct action creates gossip, not solutions.' },
        ]
      }
    ]
  },

  'Financial Analyst': {
    intro: "You're a Financial Analyst at an investment firm. Your models and reports influence major capital decisions.",
    questions: [
      {
        time: '9:00 AM',
        situation: "Your financial model shows a company is overvalued, but a senior analyst believes it is a strong buy.",
        options: [
          { letter: 'A', text: 'Change your model to align with the senior analyst', impact: -5, feedback: 'Model integrity is paramount. Never alter analysis to match opinions.' },
          { letter: 'B', text: 'Present your model with assumptions clearly documented and request a peer review', impact: 10, feedback: 'Strong analytical culture. Let data and assumptions debate, not seniority.' },
          { letter: 'C', text: 'Withdraw your analysis to avoid conflict', impact: -5, feedback: 'Suppressing your own analysis undermines the purpose of having multiple analysts.' },
        ]
      },
      {
        time: '11:00 AM',
        situation: "A client pressures you to adjust a valuation upward before their board presentation to make it look better.",
        options: [
          { letter: 'A', text: 'Make minor adjustments — it is within the range of analyst judgement', impact: -5, feedback: 'Any adjustment under client pressure crosses the line from analysis to advocacy.' },
          { letter: 'B', text: 'Decline and explain the professional and legal risks clearly', impact: 10, feedback: 'Protecting your independence is protecting your career and the market.' },
          { letter: 'C', text: 'Ask your compliance team first', impact: 10, feedback: 'Correct escalation. Compliance exists exactly for this kind of situation.' },
        ]
      },
      {
        time: '1:00 PM',
        situation: 'You make an error in a large model that has already been distributed to 50 clients.',
        options: [
          { letter: 'A', text: "Hope no one notices and fix it in the next version", impact: -5, feedback: 'Clients make financial decisions based on your models. Silent errors are unacceptable.' },
          { letter: 'B', text: 'Immediately notify your manager, issue a correction with explanation', impact: 10, feedback: 'Transparency and speed are essential. Credibility is built on handling mistakes well.' },
          { letter: 'C', text: 'Reach out to clients one by one quietly', impact: 5, feedback: 'Thoughtful but slow. A formal correction reaches everyone simultaneously.' },
        ]
      },
      {
        time: '3:00 PM',
        situation: "You overhear a colleague discussing a non-public company event that could affect a stock you're analysing.",
        options: [
          { letter: 'A', text: 'Incorporate the information into your model — it gives you an edge', impact: -5, feedback: 'Using material non-public information is insider trading. Illegal.' },
          { letter: 'B', text: 'Report the conversation to compliance immediately', impact: 10, feedback: 'Correct. Insider information must be disclosed to compliance — not used.' },
          { letter: 'C', text: 'Ignore it and continue with public data only', impact: 5, feedback: 'Better than acting on it, but you should still report the incident to compliance.' },
        ]
      },
      {
        time: '5:00 PM',
        situation: "Your model predicts a 30% market downturn. Leadership thinks you're being alarmist. A big client is about to invest heavily.",
        options: [
          { letter: 'A', text: "Soften your forecast to avoid conflict", impact: -5, feedback: 'Your job is to provide accurate analysis, not to make people comfortable.' },
          { letter: 'B', text: 'Stand by your model, document your methodology, and present it clearly', impact: 10, feedback: 'Analytical courage. Your job is to be right, not to be liked.' },
          { letter: 'C', text: 'Increase the confidence interval to show more uncertainty', impact: 5, feedback: 'Honest hedging, but do not bury the signal in uncertainty unnecessarily.' },
        ]
      }
    ]
  },

  'Entrepreneur': {
    intro: "You're building your startup from scratch. Every day is a mix of excitement, uncertainty, and decision-making with limited resources.",
    questions: [
      {
        time: '9:00 AM',
        situation: 'You have ₹5 lakh left in the bank and 2 months of runway. A growth opportunity requires ₹3 lakh in marketing spend.',
        options: [
          { letter: 'A', text: 'Spend the ₹3 lakh — growth is the priority', impact: -5, feedback: "Without validating the channel first, you're betting 60% of your runway on a guess." },
          { letter: 'B', text: "Run a ₹50,000 test campaign first to validate before committing", impact: 10, feedback: 'Smart capital allocation. Test, measure, then scale.' },
          { letter: 'C', text: 'Delay the marketing spend and focus on organic growth only', impact: 5, feedback: 'Safe, but sometimes urgency requires calculated investment.' },
        ]
      },
      {
        time: '11:00 AM',
        situation: "A large corporation offers to acquire your startup for 3x your current valuation, but you believe you're 2 years from a 10x exit.",
        options: [
          { letter: 'A', text: 'Accept immediately — certainty over speculation', impact: 5, feedback: 'Valid — de-risking is rational. But explore the offer further before deciding.' },
          { letter: 'B', text: 'Negotiate, understand terms, consult advisors, then decide based on data not emotion', impact: 10, feedback: 'Excellent. Big decisions require diligence, not gut reactions.' },
          { letter: 'C', text: 'Reject it outright — you believe in your vision', impact: 5, feedback: 'Conviction is good, but blind conviction ignores real risk.' },
        ]
      },
      {
        time: '1:00 PM',
        situation: 'Your co-founder wants to pivot the product completely. You disagree. You each own 50%.',
        options: [
          { letter: 'A', text: 'Give in to avoid conflict — the relationship matters more', impact: -5, feedback: 'Unresolved co-founder conflict is the #1 startup killer.' },
          { letter: 'B', text: 'Facilitate a data-driven discussion: customer evidence, market data, timeline', impact: 10, feedback: 'Resolve strategic disagreements with evidence, not emotion.' },
          { letter: 'C', text: 'Go to your investors to break the tie', impact: 5, feedback: 'Investors can mediate, but co-founders should try to resolve first.' },
        ]
      },
      {
        time: '3:00 PM',
        situation: 'Your first employee, a friend, is clearly underperforming and affecting the team.',
        options: [
          { letter: 'A', text: "Keep them to avoid damaging the friendship", impact: -5, feedback: 'Protecting underperforming employees hurts the team and delays a necessary conversation.' },
          { letter: 'B', text: 'Have a direct, structured performance conversation with clear expectations and timeline', impact: 10, feedback: 'Tough but right. Clarity early is kinder than prolonged underperformance.' },
          { letter: 'C', text: 'Reassign them to reduce their impact', impact: 5, feedback: 'Buys time, but avoids the real conversation that needs to happen.' },
        ]
      },
      {
        time: '5:00 PM',
        situation: "A user posts a scathing 1-star review calling your product 'useless' with 10,000 impressions.",
        options: [
          { letter: 'A', text: 'Ignore it publicly and report the post', impact: -5, feedback: 'Public criticism ignored publicly amplifies the damage.' },
          { letter: 'B', text: 'Respond publicly with empathy, acknowledge the issue, offer to fix it', impact: 10, feedback: 'How you respond to criticism in public is your brand. Own it with grace.' },
          { letter: 'C', text: 'Message them privately to ask them to remove the review', impact: 5, feedback: 'Reaching out is good, but a public empathetic response also reassures other customers.' },
        ]
      }
    ]
  },

  'Pharmacist': {
    intro: "You're a retail pharmacist. Every prescription you dispense affects a patient's health and safety.",
    questions: [
      {
        time: '9:00 AM',
        situation: "A prescription looks unusual — the dosage is 2x what you'd normally see for the indicated condition.",
        options: [
          { letter: 'A', text: 'Dispense it — the doctor signed it', impact: -5, feedback: 'Pharmacists are the last line of defence before medication errors reach patients.' },
          { letter: 'B', text: "Call the prescribing doctor to verify before dispensing", impact: 10, feedback: 'Correct. Verification calls protect patients. Doctors expect this.' },
          { letter: 'C', text: 'Dispense half the quantity and ask the patient to return', impact: -5, feedback: 'Unilaterally changing a prescription without contacting the doctor is not appropriate.' },
        ]
      },
      {
        time: '11:00 AM',
        situation: 'A patient is picking up two prescriptions that have a known drug interaction.',
        options: [
          { letter: 'A', text: 'Dispense both — the doctor must know about the interaction', impact: -5, feedback: "Do not assume. Patient safety requires you to counsel the patient and notify the prescriber." },
          { letter: 'B', text: "Counsel the patient on the interaction, flag it to the doctor, document it", impact: 10, feedback: 'Perfect pharmacist response. Inform, flag, document.' },
          { letter: 'C', text: 'Dispense only the safer of the two medications', impact: -5, feedback: 'You cannot withhold a prescribed medication unilaterally.' },
        ]
      },
      {
        time: '1:00 PM',
        situation: "A customer is clearly distressed and requests a large quantity of sleeping pills, saying it's for 'a long sleep'.",
        options: [
          { letter: 'A', text: 'Dispense the medication — the prescription is valid', impact: -5, feedback: "Red flags for self-harm require immediate action. A valid prescription doesn't override safety." },
          { letter: 'B', text: 'Engage the customer with empathy, limit the dispensed quantity, and connect them to crisis support', impact: 10, feedback: 'Excellent. Pharmacists are often the first to identify mental health crises.' },
          { letter: 'C', text: 'Refuse the prescription and ask them to come back', impact: 5, feedback: 'Caution is right, but refusing without support or conversation is not enough.' },
        ]
      },
      {
        time: '3:00 PM',
        situation: 'A drug company representative offers you gifts in exchange for recommending their products.',
        options: [
          { letter: 'A', text: 'Accept the gifts — everyone does it', impact: -5, feedback: 'Gifts that influence prescribing recommendations are unethical and often illegal.' },
          { letter: 'B', text: 'Decline and report the interaction to your pharmacy manager', impact: 10, feedback: 'Correct. Professional independence must be protected.' },
          { letter: 'C', text: "Accept the gifts but don't let them influence your recommendations", impact: -5, feedback: 'Accepting and denying influence simultaneously is not credible. Decline.' },
        ]
      },
      {
        time: '5:00 PM',
        situation: "A customer asks you to fill a prescription that looks tampered with — the handwriting on the quantity looks altered.",
        options: [
          { letter: 'A', text: "Dispense it — it's a small quantity", impact: -5, feedback: 'Potential prescription fraud must be investigated regardless of quantity.' },
          { letter: 'B', text: 'Decline politely, contact the prescribing clinic to verify, and document the incident', impact: 10, feedback: 'Correct. Suspicious prescriptions must be verified before dispensing.' },
          { letter: 'C', text: "Ask the customer for an explanation", impact: 5, feedback: 'Patients can provide context, but verification with the prescriber is still required.' },
        ]
      }
    ]
  },

  'Psychologist': {
    intro: "You're a clinical psychologist in a counselling practice. Your clients trust you with their most personal struggles.",
    questions: [
      {
        time: '9:00 AM',
        situation: "A new client arrives and during intake reveals they were recently in an abusive relationship. They ask you not to document it.",
        options: [
          { letter: 'A', text: 'Agree — maintaining trust with the client is paramount', impact: -5, feedback: "Falsifying or omitting clinical records violates professional ethics and may affect care continuity." },
          { letter: 'B', text: "Explain why documentation supports their safety and care, and document with their understanding", impact: 10, feedback: 'Client trust and clinical integrity can coexist. Explain the why.' },
          { letter: 'C', text: "Document it anyway without telling them", impact: -5, feedback: "Undisclosed documentation violates client consent and transparency." },
        ]
      },
      {
        time: '11:00 AM',
        situation: "A client discloses they have specific plans to harm someone. The session is confidential.",
        options: [
          { letter: 'A', text: "Maintain full confidentiality — they trusted you", impact: -5, feedback: "Duty to warn supersedes confidentiality when there is a specific, credible threat." },
          { letter: 'B', text: "Inform the potential victim and relevant authorities — this is your legal and ethical duty", impact: 10, feedback: 'Correct. Protecting third-party safety is a fundamental exception to confidentiality.' },
          { letter: 'C', text: "Work through their feelings and hope they don't act on it", impact: -5, feedback: "Inaction on credible, specific threats is not therapeutic — it is negligent." },
        ]
      },
      {
        time: '1:00 PM',
        situation: "You run into a client at a social event. They approach you and introduce you to their friends.",
        options: [
          { letter: 'A', text: "Engage warmly — no harm in being friendly outside sessions", impact: -5, feedback: "Dual relationships blur professional boundaries and can affect therapeutic outcomes." },
          { letter: 'B', text: "Follow the client's lead — greet briefly, do not disclose the professional relationship, and keep conversation neutral", impact: 10, feedback: "Correct. Protect the client's confidentiality in all social situations." },
          { letter: 'C', text: "Excuse yourself immediately without engaging", impact: 5, feedback: "Abrupt avoidance can embarrass the client. A brief neutral greeting is more graceful." },
        ]
      },
      {
        time: '3:00 PM',
        situation: "You are going through a difficult personal period and find yourself emotionally reactive during a session.",
        options: [
          { letter: 'A', text: "Push through — the client needs you", impact: -5, feedback: "Your emotional state affects your therapeutic effectiveness. Self-awareness is a clinical skill." },
          { letter: 'B', text: "Seek supervision or reschedule with the client if necessary", impact: 10, feedback: "Psychologists maintaining their own wellbeing is not optional — it's an ethical obligation." },
          { letter: 'C', text: "Ignore the reactivity and continue the session as normal", impact: -5, feedback: "Unaddressed countertransference can seriously harm therapeutic progress." },
        ]
      },
      {
        time: '5:00 PM',
        situation: "A client makes remarkable progress and you realise they no longer need intensive therapy. Ending sessions means losing a significant income source.",
        options: [
          { letter: 'A', text: "Continue sessions at the same frequency — they still benefit", impact: -5, feedback: "Prolonging treatment for financial reasons is unethical." },
          { letter: 'B', text: "Discuss their progress openly and begin a structured, thoughtful discharge plan", impact: 10, feedback: "The goal of therapy is resolution and independence, not dependency. This is the ethical path." },
          { letter: 'C', text: "Reduce sessions slowly without discussing the reason", impact: 5, feedback: "Better than prolonging unnecessarily, but transparent clinical discussion is more respectful." },
        ]
      }
    ]
  },

  'Content Creator': {
    intro: "You're a full-time content creator. Your audience is your business, and consistency is your product.",
    questions: [
      {
        time: '9:00 AM',
        situation: "A sponsored post you agreed to create involves a product you genuinely don't believe in. The brand paid upfront.",
        options: [
          { letter: 'A', text: "Post it as agreed — the money is already received", impact: -5, feedback: "Promoting things you don't believe in erodes audience trust over time." },
          { letter: 'B', text: "Reach out to the brand honestly, discuss your concern, and see if you can decline or restructure", impact: 10, feedback: 'Protecting your authenticity is protecting your long-term brand.' },
          { letter: 'C', text: "Post with heavy disclaimers and a lukewarm tone", impact: 5, feedback: "Lukewarm branded content satisfies neither the audience nor the brand." },
        ]
      },
      {
        time: '11:00 AM',
        situation: "A viral piece of news is trending. You have not verified it. Publishing quickly will spike your views.",
        options: [
          { letter: 'A', text: "Post immediately with your take — everyone else is already posting", impact: -5, feedback: "Spreading unverified news damages credibility and can cause real harm." },
          { letter: 'B', text: "Verify the news first, then add your perspective with added value", impact: 10, feedback: "Accuracy over speed builds lasting audience trust." },
          { letter: 'C', text: "Post a reaction video saying you are not sure if it is true", impact: 5, feedback: "Honest uncertainty is better than false confidence, but verify first if possible." },
        ]
      },
      {
        time: '1:00 PM',
        situation: "Your last 5 videos underperformed. A controversial opinion would almost certainly go viral.",
        options: [
          { letter: 'A', text: "Say the controversial thing — the algorithm rewards engagement", impact: -5, feedback: "Manufactured controversy for views is a short-term strategy with long-term brand damage." },
          { letter: 'B', text: "Analyse why the recent videos underperformed and experiment with format, not controversy", impact: 10, feedback: "Data-driven iteration beats reactive controversy every time." },
          { letter: 'C', text: "Take a 2-week break and restart with a new series concept", impact: 5, feedback: "Strategic reset can work, but understanding the root cause first is better." },
        ]
      },
      {
        time: '3:00 PM',
        situation: "A smaller creator accuses you of copying their idea. Their video came out 3 days before yours. You had the idea independently.",
        options: [
          { letter: 'A', text: "Ignore them — ideas can't be copyrighted", impact: -5, feedback: "Ignoring a public accusation lets the narrative run without your voice in it." },
          { letter: 'B', text: "Respond publicly with grace, acknowledge the overlap, and move on", impact: 10, feedback: "Handling it with class shows maturity and earns respect from your audience." },
          { letter: 'C', text: "Delete the video to avoid conflict", impact: -5, feedback: "Deleting signals guilt. If the idea was independent, say so respectfully." },
        ]
      },
      {
        time: '5:00 PM',
        situation: "You receive 50 DMs a day. A follower says your video genuinely changed their life and asks a personal question.",
        options: [
          { letter: 'A', text: "Reply personally to that specific message", impact: 10, feedback: "Human connection is what separates great creators. One reply can build a lifelong follower." },
          { letter: 'B', text: "Use a template response to manage volume", impact: 5, feedback: "Efficient, but a thoughtful personal reply to standout messages has more impact." },
          { letter: 'C', text: "Ignore it — you cannot personally reply to everyone", impact: -5, feedback: "That one reply could mean the world to them and costs you 60 seconds." },
        ]
      }
    ]
  },

  'Game Developer': {
    intro: "You're an indie game developer building your first commercial title with a small team.",
    questions: [
      {
        time: '9:00 AM',
        situation: "A key gameplay mechanic that looked great on paper feels unfun in playtesting.",
        options: [
          { letter: 'A', text: "Keep it — you spent 3 months building it", impact: -5, feedback: "Sunk cost fallacy. A fun game always wins over a technically impressive but unfun one." },
          { letter: 'B', text: "Scrap or redesign the mechanic based on playtester feedback", impact: 10, feedback: "Player experience first. Iteration is at the heart of good game development." },
          { letter: 'C', text: "Add a tutorial to teach players how to enjoy it", impact: 5, feedback: "A tutorial can help, but if the mechanic is fundamentally unfun, the tutorial won't save it." },
        ]
      },
      {
        time: '11:00 AM',
        situation: "Your release date is in 6 weeks. There are 120 known bugs in the tracker, 4 of which are critical crashes.",
        options: [
          { letter: 'A', text: "Ship on schedule — patches can fix everything post-launch", impact: -5, feedback: "Shipping with known critical crashes generates devastating reviews that are hard to recover from." },
          { letter: 'B', text: "Fix the 4 critical crashes, prioritise other bugs by player impact, and delay if needed", impact: 10, feedback: "A delayed quality launch beats a broken on-time launch. Always." },
          { letter: 'C', text: "Remove features that contain bugs rather than fixing them", impact: 5, feedback: "Feature-cutting can work as a last resort, but not before prioritising critical fixes." },
        ]
      },
      {
        time: '1:00 PM',
        situation: "A publisher offers funding for your game but wants creative control over the ending.",
        options: [
          { letter: 'A', text: "Accept all terms — the funding is what you need", impact: -5, feedback: "Losing creative control over core narrative can result in a game that doesn't match your vision." },
          { letter: 'B', text: "Negotiate specifically on the ending — keep funding, protect creative direction", impact: 10, feedback: "Smart negotiation. Know which elements are negotiable and which are not." },
          { letter: 'C', text: "Reject the deal and bootstrap", impact: 5, feedback: "Preserving creative integrity is valid, but explore negotiation before walking away." },
        ]
      },
      {
        time: '3:00 PM',
        situation: "A community moderator is bullying players in your game's Discord server. They are also one of your best volunteers.",
        options: [
          { letter: 'A', text: "Ignore it — they do too much good work to remove", impact: -5, feedback: "A toxic moderator damages your community and discourages new players from joining." },
          { letter: 'B', text: "Remove their moderation role and address the behaviour directly and publicly", impact: 10, feedback: "Community safety comes before convenience. Your response defines your game's culture." },
          { letter: 'C', text: "Give them a private warning", impact: 5, feedback: "Warnings are a reasonable first step, but if the behaviour is ongoing it must be addressed." },
        ]
      },
      {
        time: '5:00 PM',
        situation: "You find an asset in your game that closely resembles another game's copyrighted artwork.",
        options: [
          { letter: 'A', text: "Leave it in — it is just an inspiration", impact: -5, feedback: "Close resemblance to copyrighted art is copyright infringement. A lawsuit would kill your project." },
          { letter: 'B', text: "Replace the asset before launch and audit all other assets for similar issues", impact: 10, feedback: "Proactive IP compliance is essential in commercial game development." },
          { letter: 'C', text: "Change the colour scheme slightly to differentiate it", impact: -5, feedback: "Superficial changes do not resolve copyright infringement concerns." },
        ]
      }
    ]
  },

  'Environmental Scientist': {
    intro: "You're an environmental scientist working on impact assessments and field research.",
    questions: [
      {
        time: '9:00 AM',
        situation: "A development company wants a quick environmental clearance. Your data shows moderate but real ecological risk.",
        options: [
          { letter: 'A', text: "Approve it — moderate risk is acceptable for economic development", impact: -5, feedback: "Environmental clearances must be based on science, not economic pressure." },
          { letter: 'B', text: "Submit findings accurately and propose mitigation measures that could allow approved development", impact: 10, feedback: "Balanced and responsible. Science informs decisions — it doesn't block development unnecessarily." },
          { letter: 'C', text: "Delay the report to buy more study time", impact: 5, feedback: "More data is valuable, but if your current data is sufficient, report it accurately now." },
        ]
      },
      {
        time: '11:00 AM',
        situation: "Field data shows a pollutant level 3x above safe limits near a residential area. The source is the city's major employer.",
        options: [
          { letter: 'A', text: "Downplay the finding to avoid economic disruption", impact: -5, feedback: "Hiding pollution data puts people's lives at risk. This is both unethical and potentially criminal." },
          { letter: 'B', text: "Report findings immediately to the appropriate regulatory authority", impact: 10, feedback: "Environmental scientists have a public health duty. Always report accurate findings." },
          { letter: 'C', text: "Approach the company first privately to give them a chance to self-report", impact: 5, feedback: "Reasonable intent, but for a 3x exceedance near residences, regulatory reporting cannot wait." },
        ]
      },
      {
        time: '1:00 PM',
        situation: "Your funding is from a corporation whose operations are the subject of your current study.",
        options: [
          { letter: 'A', text: "Conduct the study and report accurately regardless of who funds it", impact: 10, feedback: "Scientific integrity is absolute. But also disclose the funding source transparently." },
          { letter: 'B', text: "Disclose the conflict of interest and suggest independent peer review", impact: 10, feedback: "Transparency about funding sources is critical to maintaining the credibility of findings." },
          { letter: 'C', text: "Accept the funding and skew findings to protect it", impact: -5, feedback: "Biased research funded by the subject is scientific fraud." },
        ]
      },
      {
        time: '3:00 PM',
        situation: "A colleague suggests rounding up a species count to meet the threshold that would trigger stronger environmental protections.",
        options: [
          { letter: 'A', text: "Round up — the protections are good policy anyway", impact: -5, feedback: "Scientific data must be reported accurately. Good intentions do not justify data manipulation." },
          { letter: 'B', text: "Report the actual count and note the proximity to the threshold for decision-makers", impact: 10, feedback: "Accurate data with proper context is the correct scientific approach." },
          { letter: 'C', text: "Go back and do additional sampling to get more accurate counts", impact: 10, feedback: "More data collection to reduce uncertainty is always scientifically valid." },
        ]
      },
      {
        time: '5:00 PM',
        situation: "Locals from a community affected by your study want to attend your public presentation. Your client wants it restricted to officials only.",
        options: [
          { letter: 'A', text: "Follow the client's wishes — they funded the study", impact: -5, feedback: "Environmental justice requires community access to information that affects them." },
          { letter: 'B', text: "Advocate for an open presentation or organise a separate community briefing", impact: 10, feedback: "Communities have the right to participate in decisions about their environment." },
          { letter: 'C', text: "Provide written findings to community representatives instead", impact: 5, feedback: "A reasonable compromise, but direct community engagement is more equitable." },
        ]
      }
    ]
  },

  'UX/UI Designer': {
    intro: "You're a UX/UI Designer at a product company. You champion the user in every decision.",
    questions: [
      {
        time: '9:00 AM',
        situation: "Engineering says your design will take 3 extra weeks to build. The PM wants you to simplify it.",
        options: [
          { letter: 'A', text: "Defend the design fully — user experience cannot be compromised", impact: -5, feedback: "Good UX also considers build constraints. Rigid advocacy ignores team dynamics." },
          { letter: 'B', text: "Work with engineering to identify which design elements have the highest UX impact and preserve those", impact: 10, feedback: "Collaborative problem-solving produces better products than designer-vs-engineer battles." },
          { letter: 'C', text: "Accept any simplification the PM suggests", impact: -5, feedback: "Passive compliance without UX input defeats the purpose of the design role." },
        ]
      },
      {
        time: '11:00 AM',
        situation: "Usability testing shows 60% of users cannot find the most important button on screen.",
        options: [
          { letter: 'A', text: "Add a tooltip — the design is fundamentally right", impact: -5, feedback: "If 60% of users can't find a primary CTA, the design has failed — not the users." },
          { letter: 'B', text: "Redesign the information hierarchy and retest before shipping", impact: 10, feedback: "User testing results are your most valuable data. Act on them." },
          { letter: 'C', text: "Make it slightly larger and brighter", impact: 5, feedback: "Visual prominence helps, but the root cause may be hierarchy — investigate the full picture." },
        ]
      },
      {
        time: '1:00 PM',
        situation: "The CEO personally requests adding 5 new features to the home screen. It will make it cluttered.",
        options: [
          { letter: 'A', text: "Add all 5 features — the CEO has authority", impact: -5, feedback: "Uncritical execution of feature demands creates cluttered products that users abandon." },
          { letter: 'B', text: "Present data on how each addition affects user comprehension and suggest prioritisation", impact: 10, feedback: "Speaking the language of business outcomes to leadership is a key UX skill." },
          { letter: 'C', text: "Add them but make them visually smaller to reduce clutter", impact: 5, feedback: "A workaround, but the root problem of too many features remains." },
        ]
      },
      {
        time: '3:00 PM',
        situation: "You discover the onboarding flow you designed has a 70% drop-off rate in production.",
        options: [
          { letter: 'A', text: "Attribute it to users being unfamiliar with the product", impact: -5, feedback: "Blaming users for design failures is the opposite of a user-centred mindset." },
          { letter: 'B', text: "Run session recordings and exit surveys to find the failure points and redesign", impact: 10, feedback: "Data-driven iteration is what separates great UX designers from average ones." },
          { letter: 'C', text: "Add a progress bar to encourage users to complete the flow", impact: 5, feedback: "Progress indicators help, but they don't fix underlying UX friction points." },
        ]
      },
      {
        time: '5:00 PM',
        situation: "Marketing asks you to design a dark pattern that makes it hard to cancel a subscription.",
        options: [
          { letter: 'A', text: "Design it — improving retention metrics is part of your job", impact: -5, feedback: "Dark patterns violate user trust, harm brand reputation, and in some markets are illegal." },
          { letter: 'B', text: "Decline, explain the ethical and legal risks, and propose ethical retention alternatives", impact: 10, feedback: "Ethical design advocacy is the most valuable thing a UX designer can do for a business." },
          { letter: 'C', text: "Design a version that is technically compliant but more honest", impact: 5, feedback: "Better direction, but name the dark pattern concern explicitly with the team." },
        ]
      }
    ]
  },

  'Nurse': {
    intro: "You're a registered nurse in a busy hospital ward. Patient care, protocols, and teamwork are your daily environment.",
    questions: [
      {
        time: '7:00 AM',
        situation: "During handover, the outgoing nurse mentions a patient had a 'rough night' but there's no documentation in the chart.",
        options: [
          { letter: 'A', text: "Accept the verbal handover and proceed with your shift", impact: -5, feedback: "Undocumented events leave critical care gaps. Document what you know and investigate." },
          { letter: 'B', text: "Ask the outgoing nurse for details and ensure proper documentation before they leave", impact: 10, feedback: "Good nursing practice. Documentation is patient safety." },
          { letter: 'C', text: "Document 'patient had rough night per verbal report' and continue", impact: 5, feedback: "Better than nothing, but pressing for specific details is essential." },
        ]
      },
      {
        time: '9:00 AM',
        situation: "A doctor writes an order you believe is wrong for this patient's specific condition.",
        options: [
          { letter: 'A', text: "Carry out the order — doctors are ultimately responsible", impact: -5, feedback: "Nurses have an independent duty of care. A wrong order carried out is still a harm caused." },
          { letter: 'B', text: "Clarify the order with the doctor, citing your concern, before administering", impact: 10, feedback: "Correct. Speak up respectfully but clearly. Most doctors welcome clinical dialogue." },
          { letter: 'C', text: "Withhold the medication and wait for the next ward round", impact: 5, feedback: "Withholding without communication can delay care. A direct call to the doctor is faster and better." },
        ]
      },
      {
        time: '11:00 AM',
        situation: "You are overloaded with 9 patients. A colleague is idle. You make a minor medication error.",
        options: [
          { letter: 'A', text: "Correct it quietly — no harm was caused", impact: -5, feedback: "All medication errors, even minor ones, must be reported. Incident reports improve systems." },
          { letter: 'B', text: "Report the error immediately, document it, and reflect on contributing factors including workload", impact: 10, feedback: "Transparent reporting of near-misses and errors is what makes healthcare systems safer." },
          { letter: 'C', text: "Tell your supervisor about the workload issue but not the error", impact: -5, feedback: "Reporting the workload without the error is incomplete. Both need to be disclosed." },
        ]
      },
      {
        time: '1:00 PM',
        situation: "A patient refuses a necessary blood transfusion for religious reasons.",
        options: [
          { letter: 'A', text: "Proceed with the transfusion — it is medically necessary", impact: -5, feedback: "Overriding informed patient refusal violates patient autonomy and is assault." },
          { letter: 'B', text: "Respect the refusal, ensure proper informed consent documentation, and explore alternatives with the team", impact: 10, feedback: "Correct. Patient autonomy is a fundamental right. Document thoroughly and explore clinical alternatives." },
          { letter: 'C', text: "Ask their family to convince them to accept it", impact: -5, feedback: "The patient's decision is their own. Family pressure undermines informed consent." },
        ]
      },
      {
        time: '3:00 PM',
        situation: "You witness a senior nurse being rough with a patient while transferring them.",
        options: [
          { letter: 'A', text: "Ignore it — reporting a senior colleague is risky", impact: -5, feedback: "Patient safety reporting culture requires everyone to speak up regardless of hierarchy." },
          { letter: 'B', text: "Intervene in the moment if safe, then report through proper safeguarding channels", impact: 10, feedback: "Correct. Witnessing potential abuse requires immediate and formal response." },
          { letter: 'C', text: "Speak to the colleague privately about it later", impact: 5, feedback: "A private conversation has value, but formal reporting is also required when patient safety is involved." },
        ]
      }
    ]
  },

  'Chartered Accountant': {
    intro: "You're a CA working at a mid-size firm with corporate and individual clients. Accuracy, ethics and compliance define your work.",
    questions: [
      {
        time: '9:00 AM',
        situation: "A client asks you to classify a personal expense as a business expense to reduce their tax liability.",
        options: [
          { letter: 'A', text: "Do it — it is a small amount and they won't get caught", impact: -5, feedback: "Tax fraud, regardless of size, violates your professional ethics and risks your CA licence." },
          { letter: 'B', text: "Decline and educate the client on what constitutes a legitimate business expense", impact: 10, feedback: "Your professional duty to the tax authority and the law supersedes client convenience." },
          { letter: 'C', text: "Do it but flag it as a risk in your engagement letter", impact: -5, feedback: "Documenting a fraudulent act does not make it legal or ethical." },
        ]
      },
      {
        time: '11:00 AM',
        situation: "You discover a significant error in a client's filed return from last year.",
        options: [
          { letter: 'A', text: "Leave it — it's already filed and no one has noticed", impact: -5, feedback: "A filed return with a known material error must be corrected. Ignoring it creates greater liability." },
          { letter: 'B', text: "Inform the client immediately and file a revised return", impact: 10, feedback: "Correct. Proactive disclosure is always better than discovered non-compliance." },
          { letter: 'C', text: "Fix it in the current year's return as an adjustment", impact: -5, feedback: "Prior year errors should be corrected in that period, not silently absorbed into current filings." },
        ]
      },
      {
        time: '1:00 PM',
        situation: "During an audit, you find evidence that a client has been hiding income through a shell company.",
        options: [
          { letter: 'A', text: "Complete the audit report without mentioning it — they pay your fees", impact: -5, feedback: "Concealing material fraud in an audit report is a serious professional and criminal offence." },
          { letter: 'B', text: "Confront the client, document the finding, and resign from the engagement if they refuse to disclose", impact: 10, feedback: "CAs have a reporting duty. If the client refuses disclosure, you must withdraw from the engagement." },
          { letter: 'C', text: "Mention it in a footnote that only specialists would notice", impact: -5, feedback: "Burying material findings is still a failure of your auditor duty." },
        ]
      },
      {
        time: '3:00 PM',
        situation: "A client wants an audit opinion signed by Friday, but the audit work won't be complete until the following week.",
        options: [
          { letter: 'A', text: "Sign early — the work is mostly done", impact: -5, feedback: "Signing an audit opinion before completing the required work is a professional standards violation." },
          { letter: 'B', text: "Explain the risk of premature sign-off and offer to expedite work to complete it properly", impact: 10, feedback: "Correct. Dates are business pressures — standards are non-negotiable." },
          { letter: 'C', text: "Backdate the opinion to avoid the issue", impact: -5, feedback: "Backdating a professional document is falsification. This would end your CA career." },
        ]
      },
      {
        time: '5:00 PM',
        situation: "You receive a gift worth ₹25,000 from a major audit client as a 'token of appreciation'.",
        options: [
          { letter: 'A', text: "Accept it — it's just a gift, not a bribe", impact: -5, feedback: "Gifts from audit clients directly threaten your independence. ICAI guidelines prohibit this." },
          { letter: 'B', text: "Politely decline and explain your professional independence obligations", impact: 10, feedback: "Auditor independence is fundamental. Gifts of value from audit clients must be declined." },
          { letter: 'C', text: "Accept it but recuse yourself from the next year's audit", impact: 5, feedback: "Self-recusal after accepting shows awareness, but declining in the first place is the right response." },
        ]
      }
    ]
  },
};

// Generic fallback scenario for careers not explicitly listed
export const genericScenario = {
  intro: "You're on your first week in this career. Every day brings new challenges and opportunities to demonstrate your values.",
  questions: [
    {
      time: '9:00 AM',
      situation: "You receive an urgent task that is outside your area of expertise. The deadline is end of day.",
      options: [
        { letter: 'A', text: "Attempt it alone and submit your best effort without disclosing the uncertainty", impact: 5, feedback: "Effort is admirable, but transparency about gaps prevents downstream issues." },
        { letter: 'B', text: "Acknowledge the gap, ask for guidance, and deliver with support", impact: 10, feedback: "Self-awareness and asking for help is a sign of professional maturity." },
        { letter: 'C', text: "Decline the task entirely", impact: -5, feedback: "Refusing without attempting is a missed opportunity to grow." },
      ]
    },
    {
      time: '11:00 AM',
      situation: "You notice a colleague taking shortcuts that could cause problems later. They are more senior than you.",
      options: [
        { letter: 'A', text: "Say nothing — they know more than you", impact: -5, feedback: "Seniority does not make shortcuts right. Speak up respectfully." },
        { letter: 'B', text: "Raise the concern privately with the colleague first", impact: 10, feedback: "A direct, private conversation is the most respectful and professional first step." },
        { letter: 'C', text: "Report it to your manager immediately", impact: 5, feedback: "Escalating directly may be warranted in some cases, but a colleague conversation first is usually better." },
      ]
    },
    {
      time: '1:00 PM',
      situation: "You are behind on a deliverable because of an ambiguous brief. The deadline is in 2 hours.",
      options: [
        { letter: 'A', text: "Submit something incomplete and explain after", impact: -5, feedback: "Proactive communication before missing a deadline is always better than after." },
        { letter: 'B', text: "Communicate the issue now, share your progress, and agree on a revised expectation", impact: 10, feedback: "Honest, timely communication preserves trust even when delivery is imperfect." },
        { letter: 'C', text: "Work through lunch and try to make the deadline at any quality", impact: 5, feedback: "Effort counts, but quality gaps still need to be communicated." },
      ]
    },
    {
      time: '3:00 PM',
      situation: "You are asked to present your work to senior leadership. You feel nervous and underprepared.",
      options: [
        { letter: 'A', text: "Ask a colleague to present on your behalf", impact: -5, feedback: "Avoiding visibility stunts your career growth." },
        { letter: 'B', text: "Prepare the best you can, present clearly, and be honest about uncertainties", impact: 10, feedback: "Showing up imperfectly but honestly builds more trust than polished avoidance." },
        { letter: 'C', text: "Over-promise on capabilities to impress leadership", impact: -5, feedback: "Promises you cannot keep create far bigger problems than honest limitations." },
      ]
    },
    {
      time: '5:00 PM',
      situation: "A client or stakeholder is unhappy and sends a strongly-worded message. You believe you did everything correctly.",
      options: [
        { letter: 'A', text: "Defend your work point by point in a lengthy reply", impact: -5, feedback: "Defensive replies escalate tension. Listen first, respond second." },
        { letter: 'B', text: "Acknowledge their frustration, clarify misunderstandings calmly, and propose a path forward", impact: 10, feedback: "Empathy de-escalates. Even when you're right, how you respond matters more." },
        { letter: 'C', text: "Escalate to your manager to handle the response", impact: 5, feedback: "Escalation is sometimes right, but attempting direct resolution first builds your skills." },
      ]
    }
  ]
};

export function getScenarioForCareer(careerName) {
  return shadowScenarios[careerName] || genericScenario;
}
