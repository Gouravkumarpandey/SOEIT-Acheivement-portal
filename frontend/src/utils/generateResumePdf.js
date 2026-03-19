import html2pdf from 'html2pdf.js';
import { format } from 'date-fns';

export const generateResumePdf = (data) => {
    const { student, achievements, courses, internships, projects } = data;

    // Create a temporary container
    const container = document.createElement('div');
    container.style.width = '780px';
    container.style.boxSizing = 'border-box';
    container.style.padding = '0px';
    
    // Calibri/Arial feel for modern resume
    container.style.fontFamily = '"Calibri", Arial, sans-serif';
    container.style.color = '#000';
    container.style.lineHeight = '1.25';
    container.style.backgroundColor = '#fff';

    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.marginBottom = '10px';

    const name = document.createElement('h1');
    name.textContent = student.name;
    name.style.fontSize = '32px';
    name.style.fontWeight = 'bold';
    name.style.margin = '0 0 2px 0';
    name.style.letterSpacing = '-0.02em';
    header.appendChild(name);

    const contact = document.createElement('div');
    contact.style.fontSize = '12px';
    
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
        h2.style.fontSize = '16px';
        h2.style.fontWeight = 'bold';
        h2.style.margin = '14px 0 6px 0';
        h2.style.paddingBottom = '2px';
        h2.style.borderBottom = '1.5px solid #000';
        h2.style.textTransform = 'none';
        return h2;
    };

    const createRow = (leftHtml, rightHtml) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.fontSize = '13.5px';
        row.style.marginBottom = '1px';

        const left = document.createElement('div');
        left.innerHTML = leftHtml;
        const right = document.createElement('div');
        right.innerHTML = rightHtml;

        row.appendChild(left);
        row.appendChild(right);
        return row;
    };

    const createBullets = (lines) => {
        const ul = document.createElement('ul');
        ul.style.margin = '2px 0 4px 0';
        ul.style.paddingLeft = '18px';
        ul.style.listStyleType = 'none';

        lines.forEach(line => {
            if (!line.trim()) return;
            const li = document.createElement('li');
            li.style.fontSize = '13px';
            li.style.marginBottom = '1px';
            li.innerHTML = `&ndash; &nbsp;${line.trim()}`;
            ul.appendChild(li);
        });
        return ul;
    };

    // Career Objective Section
    if (student.bio) {
        container.appendChild(createSectionHeader('Career Objective'));
        const bioP = document.createElement('div');
        bioP.textContent = student.bio;
        bioP.style.fontSize = '13px';
        bioP.style.textAlign = 'justify';
        container.appendChild(bioP);
    }

    // Education Section
    container.appendChild(createSectionHeader('Education'));
    
    // University
    container.appendChild(createRow(
        `<strong>${student.universityName || 'Arka Jain University, Jamshedpur'}</strong>`, 
        student.universityCgpa ? `CGPA: ${student.universityCgpa}` : ''
    ));
    container.appendChild(createRow(
        `<em>Bachelor of Technology in ${student.department || 'Computer Science & Engineering'}</em>`, 
        `<em>Aug 2022 - May 2026</em>`
    ));

    // 12th
    if (student.edu12thSchool) {
        container.appendChild(createRow(
            `<strong>${student.edu12thSchool}</strong>`,
            student.edu12thPercent ? `Percentage: ${student.edu12thPercent}` : ''
        ));
        container.appendChild(createRow(
            `<em>Senior Secondary (PCM/PCB)</em>`,
            `<em>${student.edu12thYear || ''}</em>`
        ));
    }

    // 10th
    if (student.edu10thSchool) {
        container.appendChild(createRow(
            `<strong>${student.edu10thSchool}</strong>`,
            student.edu10thPercent ? `Percentage: ${student.edu10thPercent}` : ''
        ));
        container.appendChild(createRow(
            `<em>Secondary Education</em>`,
            `<em>${student.edu10thYear || ''}</em>`
        ));
    }

    // Technical Skills
    if (student.skills) {
        container.appendChild(createSectionHeader('Technical Skills'));
        const skillLines = student.skills.split('\n').filter(s => s.trim());
        skillLines.forEach(line => {
            const div = document.createElement('div');
            div.style.fontSize = '13.5px';
            div.style.marginBottom = '2px';
            const parts = line.split(':');
            if (parts.length > 1) {
                div.innerHTML = `<strong>${parts[0].trim()}:</strong> ${parts.slice(1).join(':').trim()}`;
            } else {
                div.textContent = line.trim();
            }
            container.appendChild(div);
        });
    }

    // Experience Section
    if (internships && internships.length > 0) {
        container.appendChild(createSectionHeader('Experience'));
        internships.forEach(exp => {
            const startStr = exp.start_date ? format(new Date(exp.start_date), 'MMM yyyy') : '';
            const endStr = exp.status === 'Ongoing' ? 'Present' : (exp.end_date ? format(new Date(exp.end_date), 'MMM yyyy') : '');
            
            container.appendChild(createRow(
                `<strong>${exp.company_name}</strong>`,
                `${startStr} - ${endStr}`
            ));
            container.appendChild(createRow(
                `<em>${exp.role}</em>`,
                `<em>${exp.location || ''}</em>`
            ));

            if (exp.description) {
                container.appendChild(createBullets(exp.description.split('\n')));
            }
        });
    }

    // Projects Section
    if (projects && projects.length > 0) {
        container.appendChild(createSectionHeader('Projects'));
        projects.forEach(proj => {
            container.appendChild(createRow(
                `<strong>${proj.title} | ${proj.techStack || ''}</strong>`,
                proj.githubLink ? `<span style="text-decoration: underline;">GitHub Link</span>` : ''
            ));
            if (proj.description) {
                container.appendChild(createBullets(proj.description.split('\n')));
            }
        });
    }

    // Achievements Section
    const legitAchievements = achievements?.filter(a => a.category !== 'Internship' && a.category !== 'Project');
    if (legitAchievements && legitAchievements.length > 0) {
        container.appendChild(createSectionHeader('Achievements'));
        legitAchievements.forEach(ach => {
            const dateStr = ach.date ? ` (${format(new Date(ach.date), 'yyyy')})` : '';
            const div = document.createElement('div');
            div.style.fontSize = '13px';
            div.style.marginBottom = '3px';
            div.innerHTML = `<strong>${ach.title}</strong> — ${ach.description || 'Verified Accomplishment'}${dateStr}.`;
            container.appendChild(div);
        });
    }

    // Courses
    if (courses && courses.length > 0) {
        container.appendChild(createSectionHeader('Relevant Courses & Certifications'));
        courses.forEach(course => {
            const div = document.createElement('div');
            div.style.fontSize = '13px';
            div.style.marginBottom = '2px';
            div.innerHTML = `&bull; <strong>${course.course_name}</strong> — ${course.platform} (${course.status})`;
            container.appendChild(div);
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
