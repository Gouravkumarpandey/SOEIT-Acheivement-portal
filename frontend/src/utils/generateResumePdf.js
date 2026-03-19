import html2pdf from 'html2pdf.js';
import { format } from 'date-fns';

export const generateResumePdf = (data) => {
    const { student, achievements, courses } = data;

    // Create a temporary container
    const container = document.createElement('div');
    container.style.width = '740px';
    container.style.boxSizing = 'border-box';
    container.style.padding = '10px';
    
    // Times New Roman, matching standard professional latex style
    container.style.fontFamily = '"Times New Roman", Times, serif';
    container.style.color = '#000';
    container.style.lineHeight = '1.3';
    container.style.backgroundColor = '#fff';

    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.marginBottom = '12px';

    const name = document.createElement('h1');
    name.textContent = student.name;
    name.style.fontSize = '36px';
    name.style.fontWeight = 'bold';
    name.style.margin = '0 0 4px 0';
    header.appendChild(name);

    const contact = document.createElement('div');
    contact.style.fontSize = '12.5px';
    
    const contactInfoHtml = [];
    if (student.phone) contactInfoHtml.push(`+91-${student.phone.replace('+91-', '')}`);
    if (student.email) contactInfoHtml.push(student.email);
    if (student.linkedIn) contactInfoHtml.push(`<span style="text-decoration: underline;">LinkedIn</span>`);
    if (student.github) contactInfoHtml.push(`<span style="text-decoration: underline;">GitHub</span>`);
    if (student.portfolio) contactInfoHtml.push(`<span style="text-decoration: underline;">Portfolio</span>`);
    
    contact.innerHTML = contactInfoHtml.join(' &nbsp;|&nbsp; ');
    header.appendChild(contact);
    container.appendChild(header);

    const createSectionHeader = (title) => {
        const h2 = document.createElement('h2');
        h2.textContent = title;
        h2.style.fontSize = '17px';
        h2.style.fontWeight = 'bold';
        h2.style.margin = '10px 0 4px 0';
        h2.style.paddingBottom = '3px';
        h2.style.borderBottom = '1px solid #000';
        return h2;
    };

    const createRow = (leftHtml, rightHtml) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.fontSize = '14.5px';
        row.style.marginBottom = '1px';

        const left = document.createElement('div');
        left.innerHTML = leftHtml;
        const right = document.createElement('div');
        right.innerHTML = rightHtml;

        row.appendChild(left);
        row.appendChild(right);
        return row;
    };

    // Career Objective Section
    if (student.bio) {
        container.appendChild(createSectionHeader('Career Objective'));
        
        const bioP = document.createElement('div');
        bioP.textContent = student.bio;
        bioP.style.fontSize = '14px';
        bioP.style.margin = '2px 0 6px 0';
        bioP.style.textAlign = 'justify';
        container.appendChild(bioP);
    }

    // Education Section
    container.appendChild(createSectionHeader('Education'));

    // Example mapping to the format in the picture
    // University Education (from DB)
    const uniRow = createRow(
        `<strong>${student.universityName || 'Arka Jain University, Jamshedpur'}</strong>`, 
        student.universityCgpa ? `Current CGPA: ${student.universityCgpa}` : (student.department ? `Department of ${student.department}` : '')
    );
    container.appendChild(uniRow);

    const degRow = createRow(
        `<em>Bachelor of Technology (or Equivalent)</em>`, 
        `<em>Sem ${student.semester || 'N/A'} | Batch ${student.batch || '2022-26'}</em>`
    );
    degRow.style.marginBottom = '2px';
    container.appendChild(degRow);

    // 12th Education
    if (student.edu12thSchool) {
        const edu12Row = createRow(
            `<strong>${student.edu12thSchool}</strong>`,
            student.edu12thPercent ? `Percentage: ${student.edu12thPercent}` : ''
        );
        container.appendChild(edu12Row);
        
        const edu12SubRow = createRow(
            `<em>Senior Secondary (PCM/PCB)</em>`,
            student.edu12thYear ? `<em>${student.edu12thYear}</em>` : ''
        );
        edu12SubRow.style.marginBottom = '2px';
        container.appendChild(edu12SubRow);
    }

    // 10th Education
    if (student.edu10thSchool) {
        const edu10Row = createRow(
            `<strong>${student.edu10thSchool}</strong>`,
            student.edu10thPercent ? `Percentage: ${student.edu10thPercent}` : ''
        );
        container.appendChild(edu10Row);
        
        const edu10SubRow = createRow(
            `<em>Secondary Education</em>`,
            student.edu10thYear ? `<em>${student.edu10thYear}</em>` : ''
        );
        edu10SubRow.style.marginBottom = '8px';
        container.appendChild(edu10SubRow);
    }

    // Experience / Achievements Section
    if (achievements && achievements.length > 0) {
        container.appendChild(createSectionHeader('Experience & Achievements'));

        const categories = [...new Set(achievements.map(a => a.category))];
        categories.forEach(category => {
            const catAchievements = achievements.filter(a => a.category === category);
            catAchievements.forEach(ach => {
                const item = document.createElement('div');
                item.style.marginBottom = '6px';

                const r1 = createRow(`<strong>${ach.title}</strong>`, ach.date ? format(new Date(ach.date), 'MMM yyyy') : '');
                item.appendChild(r1);

                const r2 = createRow(`<em>${ach.institution || category}</em>`, `<em>Level: ${ach.level}</em>`);
                item.appendChild(r2);

                if (ach.description) {
                    const ul = document.createElement('ul');
                    ul.style.margin = '2px 0 0 0';
                    ul.style.paddingLeft = '18px';
                    ul.style.listStyleType = 'none';

                    // Use splitting to make bullet points natively
                    const descLines = ach.description.split('\n').filter(d => d.trim().length > 0);
                    if (descLines.length === 0) descLines.push('Verified Accomplishment.');

                    descLines.forEach(line => {
                        const li = document.createElement('li');
                        li.style.fontSize = '14px';
                        li.style.position = 'relative';
                        // Add an em dash instead of standard bullet for the LaTeX experience block feel
                        li.innerHTML = `&ndash; &nbsp;${line.trim()}`;
                        ul.appendChild(li);
                    });
                    item.appendChild(ul);
                }

                container.appendChild(item);
            });
        });
    }

    // Courses / Certifications Section
    if (courses && courses.length > 0) {
        container.appendChild(createSectionHeader('Projects & Certifications'));

        courses.forEach(course => {
            const item = document.createElement('div');
            item.style.marginBottom = '6px';

            const r1 = createRow(`<strong>${course.course_name}</strong> &nbsp;|&nbsp; <strong>${course.platform}</strong>`, `Status: ${course.status}`);
            item.appendChild(r1);
            container.appendChild(item);
        });
    }

    const opt = {
        margin: [0.4, 0.4, 0.4, 0.4],
        filename: `${student.name.replace(/\s+/g, '_')}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(container).save();
};
