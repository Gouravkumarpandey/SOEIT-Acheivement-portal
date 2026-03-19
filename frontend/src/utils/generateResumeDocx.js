import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, TabStopType, TabStopPosition } from 'docx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

export const generateResumeDocx = async (data) => {
    const { student, achievements, courses } = data;

    const createContactInfo = () => {
        const contactInfo = [];
        if (student.phone) contactInfo.push(`+91-${student.phone.replace('+91-', '')}`);
        if (student.email) contactInfo.push(student.email);
        if (student.linkedIn) contactInfo.push(`LinkedIn`);
        if (student.github) contactInfo.push(`GitHub`);
        if (student.portfolio) contactInfo.push(`Portfolio`);

        return new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: contactInfo.join('  |  '),
                    size: 21,
                    font: "Times New Roman",
                    color: "000000"
                })
            ],
            spacing: { after: 200 },
        });
    };

    const sections = [];

    // Header
    sections.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: student.name,
                    size: 56, // 28pt
                    bold: true,
                    font: "Times New Roman"
                })
            ],
            spacing: { after: 100 },
        }),
        createContactInfo()
    );

    const createSectionHeader = (title) => {
        return new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
        });
    };

    const createRow = (leftText, rightText, boldLeft = false, italicLeft = false, boldRight = false, italicRight = false) => {
        return new Paragraph({
            tabStops: [
                {
                    type: TabStopType.RIGHT,
                    position: 10000, 
                },
            ],
            children: [
                new TextRun({ text: leftText, bold: boldLeft, italics: italicLeft, size: 22, font: "Times New Roman" }),
                new TextRun({ text: `\t${rightText}`, bold: boldRight, italics: italicRight, size: 22, font: "Times New Roman" })
            ],
            spacing: { before: 50, after: 50 }
        });
    };

    // Career Objective Section
    if (student.bio) {
        sections.push(
            createSectionHeader("Career Objective"),
            new Paragraph({
                children: [
                    new TextRun({
                        text: student.bio,
                        size: 22,
                        font: "Times New Roman"
                    })
                ],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { before: 100, after: 150 }
            })
        );
    }

    // Education Section
    sections.push(createSectionHeader("Education"));
    
    sections.push(createRow(
        student.institution || 'University Name', 
        student.department ? `Department of ${student.department}` : '',
        true, false, false, false
    ));
    
    sections.push(createRow(
        'Bachelor of Technology (or Equivalent)', 
        `${student.semester ? `Semester ${student.semester}` : ''} ${student.batch ? `| Batch ${student.batch}` : ''}`,
        false, true, false, true
    ));
    
    // 12th Education
    if (student.edu12thSchool) {
        sections.push(createRow(
            student.edu12thSchool,
            student.edu12thPercent ? `Percentage: ${student.edu12thPercent}` : '',
            true, false, false, false
        ));
        sections.push(createRow(
            'Senior Secondary (PCM/PCB)',
            student.edu12thYear || '',
            false, true, false, true
        ));
    }

    // 10th Education
    if (student.edu10thSchool) {
        sections.push(createRow(
            student.edu10thSchool,
            student.edu10thPercent ? `Percentage: ${student.edu10thPercent}` : '',
            true, false, false, false
        ));
        sections.push(createRow(
            'Secondary Education',
            student.edu10thYear || '',
            false, true, false, true
        ));
    }
    
    sections.push(new Paragraph({ spacing: { after: 150 } }));

    // Experience / Achievements Section
    if (achievements && achievements.length > 0) {
        sections.push(createSectionHeader("Experience & Achievements"));

        const categories = [...new Set(achievements.map(a => a.category))];
        
        categories.forEach(category => {
            const catAchievements = achievements.filter(a => a.category === category);
            
            catAchievements.forEach(ach => {
                const dateStr = ach.date ? format(new Date(ach.date), 'MMM yyyy') : '';
                
                sections.push(createRow(
                    ach.title, 
                    dateStr,
                    true, false, false, false
                ));
                
                sections.push(createRow(
                    ach.institution || category, 
                    `Level: ${ach.level}`,
                    false, true, false, true
                ));

                if (ach.description) {
                    const descLines = ach.description.split('\n').filter(d => d.trim().length > 0);
                    if (descLines.length === 0) descLines.push('Verified Accomplishment.');

                    descLines.forEach(line => {
                        sections.push(new Paragraph({
                            children: [
                                new TextRun({ text: `–  ${line.trim()}`, size: 22, font: "Times New Roman" })
                            ],
                            indent: { left: 360 }, // approx 0.25 inch
                            spacing: { before: 40, after: 40 }
                        }));
                    });
                }
                
                sections.push(new Paragraph({ spacing: { after: 150 } }));
            });
        });
    }

    // Courses / Certifications
    if (courses && courses.length > 0) {
        sections.push(createSectionHeader("Projects & Certifications"));

        courses.forEach(course => {
            sections.push(createRow(
                `${course.course_name} | ${course.platform}`, 
                `Status: ${course.status}`,
                true, false, false, false
            ));
        });
    }

    const doc = new Document({
        styles: {
            paragraphStyles: [
                {
                    id: "Heading1",
                    name: "Heading 1",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        size: 26,
                        bold: true,
                        font: "Times New Roman",
                        color: "000000",
                    },
                    paragraph: {
                        spacing: { before: 200, after: 100 },
                        border: {
                            bottom: {
                                color: "000000",
                                space: 1,
                                value: "single",
                                size: 6,
                            },
                        },
                    },
                },
                {
                    id: "Normal",
                    name: "Normal",
                    run: {
                        font: "Times New Roman",
                        size: 22,
                        color: "000000"
                    }
                }
            ],
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 576,    // 0.4 inch
                            right: 576,
                            bottom: 576,
                            left: 576,
                        },
                    },
                },
                children: sections,
            },
        ],
    });

    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, `${student.name.replace(/\s+/g, '_')}_Resume.docx`);
};
