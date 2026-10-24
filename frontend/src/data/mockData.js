// NIU Notes - Comprehensive Academic Mock Dataset

export const CURRENT_STUDENT = {
  id: 'user-rahul',
  name: 'Rahul Kumar',
  email: 'rahul.kumar@niu.edu.in',
  role: 'STUDENT', // 'STUDENT' or 'ADMIN'
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  academicCourse: 'B.Tech Computer Science Engineering',
  academicCourseCode: 'B.Tech CSE',
  currentSemester: 2,
  totalSemesters: 8,
  college: 'School of Engineering & Technology',
  rollNumber: 'NIU2023BCSE042',
  joinedDate: 'Aug 2023',
};

export const ACADEMIC_COURSES = [
  { id: 'btech-cse', name: 'B.Tech Computer Science Engineering', code: 'B.Tech CSE', duration: '4 Years (8 Semesters)' },
  { id: 'btech-ece', name: 'B.Tech Electronics & Communication', code: 'B.Tech ECE', duration: '4 Years (8 Semesters)' },
  { id: 'bca', name: 'Bachelor of Computer Applications', code: 'BCA', duration: '3 Years (6 Semesters)' },
  { id: 'mca', name: 'Master of Computer Applications', code: 'MCA', duration: '2 Years (4 Semesters)' },
  { id: 'other', name: 'Other Academic Programs', code: 'Other', duration: 'Varies' }
];

export const SEMESTERS_DATA = [
  { semesterNumber: 1, name: 'Semester 1', notesCount: 42, subjectsCount: 5, status: 'Completed', isCurrent: false },
  { semesterNumber: 2, name: 'Semester 2', notesCount: 18, subjectsCount: 5, status: 'In Progress', isCurrent: true },
  { semesterNumber: 3, name: 'Semester 3', notesCount: 0, subjectsCount: 6, status: 'Upcoming', isCurrent: false },
  { semesterNumber: 4, name: 'Semester 4', notesCount: 0, subjectsCount: 6, status: 'Upcoming', isCurrent: false },
  { semesterNumber: 5, name: 'Semester 5', notesCount: 0, subjectsCount: 5, status: 'Upcoming', isCurrent: false },
  { semesterNumber: 6, name: 'Semester 6', notesCount: 0, subjectsCount: 5, status: 'Upcoming', isCurrent: false },
  { semesterNumber: 7, name: 'Semester 7', notesCount: 0, subjectsCount: 4, status: 'Upcoming', isCurrent: false },
  { semesterNumber: 8, name: 'Semester 8', notesCount: 0, subjectsCount: 3, status: 'Upcoming', isCurrent: false },
];

export const SUBJECTS_BY_SEMESTER = {
  1: [
    {
      id: 'sub-c-prog',
      name: 'Programming in C',
      code: 'CS101',
      lecturesCount: 8,
      notesCount: 14,
      icon: 'Terminal',
      description: 'Foundations of procedural programming, variables, control flow, pointers and memory.',
      color: 'indigo'
    },
    {
      id: 'sub-math-1',
      name: 'Mathematics I',
      code: 'MA101',
      lecturesCount: 6,
      notesCount: 10,
      icon: 'Calculator',
      description: 'Differential calculus, matrices, eigenvalues and multivariable functions.',
      color: 'blue'
    },
    {
      id: 'sub-physics',
      name: 'Physics',
      code: 'PH101',
      lecturesCount: 7,
      notesCount: 8,
      icon: 'Atom',
      description: 'Optics, electromagnetic theory, quantum mechanics basics and semiconductor physics.',
      color: 'cyan'
    },
    {
      id: 'sub-digital-logic',
      name: 'Digital Logic',
      code: 'CS102',
      lecturesCount: 5,
      notesCount: 6,
      icon: 'Cpu',
      description: 'Number systems, Boolean algebra, logic gates, combinational and sequential circuits.',
      color: 'emerald'
    },
    {
      id: 'sub-comm-skills',
      name: 'Communication Skills',
      code: 'HU101',
      lecturesCount: 4,
      notesCount: 4,
      icon: 'MessageSquare',
      description: 'Professional technical writing, presentations, phonetics and interpersonal skills.',
      color: 'amber'
    }
  ],
  2: [
    {
      id: 'sub-ds',
      name: 'Data Structures',
      code: 'CS201',
      lecturesCount: 10,
      notesCount: 18,
      icon: 'Layers',
      description: 'Arrays, linked lists, stacks, queues, trees, graphs, sorting and asymptotic analysis.',
      color: 'indigo'
    },
    {
      id: 'sub-discrete-math',
      name: 'Discrete Mathematics',
      code: 'MA201',
      lecturesCount: 6,
      notesCount: 9,
      icon: 'GitBranch',
      description: 'Set theory, predicate logic, recurrence relations, graph theory and combinatorics.',
      color: 'purple'
    },
    {
      id: 'sub-digital-electronics',
      name: 'Digital Electronics',
      code: 'EC201',
      lecturesCount: 5,
      notesCount: 7,
      icon: 'Zap',
      description: 'Flip-flops, counters, registers, memory architecture and logic families.',
      color: 'amber'
    },
    {
      id: 'sub-oop',
      name: 'Object Oriented Programming',
      code: 'CS202',
      lecturesCount: 8,
      notesCount: 12,
      icon: 'Code',
      description: 'Classes, objects, encapsulation, inheritance, polymorphism, and templates.',
      color: 'sky'
    },
    {
      id: 'sub-computer-org',
      name: 'Computer Organization',
      code: 'CS203',
      lecturesCount: 6,
      notesCount: 8,
      icon: 'HardDrive',
      description: 'CPU architecture, instruction set, pipelining, memory hierarchy and I/O systems.',
      color: 'rose'
    }
  ],
  3: [
    { id: 'sub-os', name: 'Operating Systems', code: 'CS301', lecturesCount: 8, notesCount: 0, icon: 'Cpu', description: 'Process management, concurrency, virtual memory, file systems.', color: 'indigo' },
    { id: 'sub-dbms', name: 'Database Management Systems', code: 'CS302', lecturesCount: 8, notesCount: 0, icon: 'Layers', description: 'ER modeling, relational algebra, SQL, normalization, transactions.', color: 'blue' },
    { id: 'sub-algo', name: 'Design & Analysis of Algorithms', code: 'CS303', lecturesCount: 9, notesCount: 0, icon: 'GitBranch', description: 'Divide & conquer, greedy, dynamic programming, NP-completeness.', color: 'emerald' },
    { id: 'sub-java', name: 'Java Programming', code: 'CS304', lecturesCount: 7, notesCount: 0, icon: 'Code', description: 'JVM architecture, multithreading, collections, Swing/JavaFX.', color: 'amber' },
    { id: 'sub-automata', name: 'Formal Language & Automata', code: 'CS305', lecturesCount: 6, notesCount: 0, icon: 'HardDrive', description: 'DFA, NFA, context-free grammars, Turing machines.', color: 'purple' },
    { id: 'sub-econ', name: 'Engineering Economics', code: 'HU301', lecturesCount: 4, notesCount: 0, icon: 'MessageSquare', description: 'Cost analysis, project evaluation, depreciation, market models.', color: 'slate' }
  ],
  4: [
    { id: 'sub-cn', name: 'Computer Networks', code: 'CS401', lecturesCount: 8, notesCount: 0, icon: 'Layers', description: 'OSI, TCP/IP, routing algorithms, transport protocols, network security.', color: 'indigo' },
    { id: 'sub-se', name: 'Software Engineering', code: 'CS402', lecturesCount: 7, notesCount: 0, icon: 'Code', description: 'SDLC, Agile, testing, software architecture, maintenance.', color: 'sky' }
  ]
};

export const LECTURES_BY_SUBJECT = {
  'sub-c-prog': [
    { id: 'lec-c-1', number: 1, title: 'Introduction to C & Program Structure', notesCount: 3, description: 'Compilation process, preprocessor directives, main function and headers.' },
    { id: 'lec-c-2', number: 2, title: 'Variables, Constants & Data Types', notesCount: 4, description: 'Primary and derived data types, type casting, qualifiers and memory sizes.' },
    { id: 'lec-c-3', number: 3, title: 'Operators & Expressions', notesCount: 2, description: 'Arithmetic, logical, relational, bitwise and ternary operator precedence.' },
    { id: 'lec-c-4', number: 4, title: 'Control Statements & Loops', notesCount: 5, description: 'If-else branches, switch cases, while, do-while and for iteration constructs.' },
    { id: 'lec-c-5', number: 5, title: 'Functions & Modular Code', notesCount: 2, description: 'Call by value, call by reference, recursion and storage classes.' },
    { id: 'lec-c-6', number: 6, title: 'Arrays & String Manipulation', notesCount: 3, description: '1D and 2D arrays, string library functions, null-terminator rules.' },
    { id: 'lec-c-7', number: 7, title: 'Pointers & Dynamic Memory', notesCount: 3, description: 'Pointer arithmetic, malloc, calloc, realloc, free and double pointers.' },
    { id: 'lec-c-8', number: 8, title: 'Structures, Unions & Files', notesCount: 2, description: 'Typedef, structure alignment, file streams (fopen, fread, fwrite).' }
  ],
  'sub-ds': [
    { id: 'lec-ds-1', number: 1, title: 'Introduction to Data Structures & Big-O', notesCount: 3, description: 'Time and space complexity, asymptotic notations, best/worst/average case.' },
    { id: 'lec-ds-2', number: 2, title: 'Arrays & Matrix Operations', notesCount: 2, description: 'Row-major vs column-major addressing, sparse matrices.' },
    { id: 'lec-ds-3', number: 3, title: 'Singly & Doubly Linked Lists', notesCount: 4, description: 'Node structures, insertion, deletion, reversal and circular lists.' },
    { id: 'lec-ds-4', number: 4, title: 'Stacks & Infix-Postfix Conversions', notesCount: 3, description: 'LIFO principle, expression parsing, recursion call-stack simulation.' },
    { id: 'lec-ds-5', number: 5, title: 'Queues & Circular Queues', notesCount: 2, description: 'FIFO, double-ended queues (deque), priority queue with heaps.' },
    { id: 'lec-ds-6', number: 6, title: 'Binary Trees & Traversals', notesCount: 4, description: 'Preorder, Inorder, Postorder, Level order, tree properties.' }
  ],
  'sub-math-1': [
    { id: 'lec-m1-1', number: 1, title: 'Matrices & Rank of Matrix', notesCount: 2, description: 'Echelon form, Gauss-Jordan elimination, consistency of linear equations.' },
    { id: 'lec-m1-2', number: 2, title: 'Eigenvalues & Eigenvectors', notesCount: 3, description: 'Cayley-Hamilton theorem, diagonalization of symmetric matrices.' },
    { id: 'lec-m1-3', number: 3, title: 'Differential Calculus & Mean Value Theorems', notesCount: 3, description: 'Rolle’s Theorem, Lagrange’s and Cauchy’s Mean Value Theorems.' }
  ]
};

export const INITIAL_NOTES = [
  {
    id: 'note-c-operators-1',
    title: 'Operators in C - Class Notes',
    description: 'Comprehensive lecture notes covering operator precedence, bitwise logic, short-circuit evaluation, and tricky exam questions.',
    course: 'B.Tech CSE',
    courseId: 'btech-cse',
    semester: 1,
    subject: 'Programming in C',
    subjectId: 'sub-c-prog',
    lecture: 'Lecture 3 - Operators',
    lectureId: 'lec-c-3',
    organizationType: 'Lecture',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    pages: 12,
    owner: 'Rahul Kumar',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isOwner: true,
    visibility: 'PUBLIC',
    createdAt: '2 days ago',
    dateFull: 'Oct 06, 2024',
    views: 142,
    downloads: 34,
    content: `# Operators in C - Complete Lecture Summary
## Instructor: Prof. Sharma | Course: CS101

### 1. Categories of Operators in C
In C programming, operators are symbols that tell the compiler to perform specific mathematical or logical manipulations.

#### A. Arithmetic Operators
- \`+\` Addition
- \`-\` Subtraction
- \`*\` Multiplication
- \`/\` Division (Integer division truncates decimals toward zero)
- \`%\` Modulo (Only valid on integer operands; returns remainder)

#### B. Relational & Equality Operators
Used for comparison between two operands:
- \`==\` Equal to
- \`!=\` Not equal to
- \`>\` Greater than
- \`<\` Less than
- \`>=\` Greater than or equal to
- \`<=\` Less than or equal to

> **Note on evaluation:** In C, any non-zero value evaluates to TRUE (1), while 0 represents FALSE.

#### C. Bitwise Operators
Directly manipulate bits of integral variables:
- \`&\` Bitwise AND
- \`|\` Bitwise OR
- \`^\` Bitwise XOR
- \`~\` Bitwise NOT (1's complement)
- \`<<\` Left shift (Multiplies by $2^n$)
- \`>>\` Right shift (Divides by $2^n$)

### 2. Operator Precedence & Associativity Table
1. Parentheses \`()\` \`[]\` \`->\` \`.\` (Left to Right)
2. Unary \`++\` \`--\` \`!\` \`~\` \`*(deref)\` \`&(address)\` \`sizeof\` (Right to Left)
3. Multiplicative \`*\` \`/\` \`%\` (Left to Right)
4. Additive \`+\` \`-\` (Left to Right)
5. Shift \`<<\` \`>>\` (Left to Right)
6. Relational \`<\` \`<=\` \`>\` \`>=\` (Left to Right)
7. Equality \`==\` \`!=\` (Left to Right)
8. Bitwise AND \`&\` (Left to Right)
9. Bitwise XOR \`^\` (Left to Right)
10. Bitwise OR \`|\` (Left to Right)
11. Logical AND \`&&\` (Left to Right) [Short-circuiting applies!]
12. Logical OR \`||\` (Left to Right) [Short-circuiting applies!]
13. Conditional \`? :\` (Right to Left)
14. Assignment \`=\` \`+=\` \`-=\` (Right to Left)

### 3. Key Exam Traps & Tricks
- **Increment in expressions:** \`int x = 5; int y = x++ + ++x;\` results in undefined behavior across different compilers according to C99 standards! Avoid modifying the same variable multiple times in a sequence point.
- **Short-circuiting:** In \`(a && b++)\`, if \`a\` is zero, \`b++\` is **never executed**.
`
  },
  {
    id: 'note-c-operators-2',
    title: 'Operators Important Questions & Solutions',
    description: 'Past 5 years solved university exam questions on C operator precedence, bitwise masking, and evaluation trees.',
    course: 'B.Tech CSE',
    courseId: 'btech-cse',
    semester: 1,
    subject: 'Programming in C',
    subjectId: 'sub-c-prog',
    lecture: 'Lecture 3 - Operators',
    lectureId: 'lec-c-3',
    organizationType: 'Lecture',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    pages: 4,
    owner: 'Rahul Kumar',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isOwner: true,
    visibility: 'PUBLIC',
    createdAt: '3 days ago',
    dateFull: 'Oct 05, 2024',
    views: 89,
    downloads: 21,
    content: `# Question Bank: Operators in C
## Semester 1 Mid-Term Revision

### Q1. What is the output of the following code snippet?
\`\`\`c
#include <stdio.h>
int main() {
    int a = 10, b = 20, c = 30;
    if (c > b > a) {
        printf("TRUE\\n");
    } else {
        printf("FALSE\\n");
    }
    return 0;
}
\`\`\`
**Answer:**
Output is \`FALSE\`.
**Explanation:** Relational operators evaluate left-to-right.
First, \`c > b\` is evaluated: \`30 > 20\` -> \`1\` (True).
Next, \`1 > a\` is evaluated: \`1 > 10\` -> \`0\` (False).
Therefore, the \`else\` block executes.

---

### Q2. How can you swap two numbers without using a third variable using bitwise operators?
\`\`\`c
a = a ^ b;
b = a ^ b;
a = a ^ b;
\`\`\`
`
  },
  {
    id: 'note-c-pointers-1',
    title: 'Pointers & Memory Addressing in C',
    description: 'Detailed diagrams on heap, stack, pointer arithmetic, void pointers, and function pointers.',
    course: 'B.Tech CSE',
    courseId: 'btech-cse',
    semester: 1,
    subject: 'Programming in C',
    subjectId: 'sub-c-prog',
    lecture: 'Lecture 7 - Pointers & Dynamic Memory',
    lectureId: 'lec-c-7',
    organizationType: 'Lecture',
    fileType: 'PDF',
    fileSize: '3.8 MB',
    pages: 16,
    owner: 'Rahul Kumar',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isOwner: true,
    visibility: 'PRIVATE',
    createdAt: '1 week ago',
    dateFull: 'Sep 29, 2024',
    views: 12,
    downloads: 2,
    content: `# Pointers & Dynamic Memory Architecture
## Personal Private Study Notes

### Core Concepts:
- A pointer is a variable whose value is the memory address of another variable.
- \`&\` (Address-of operator) returns the hexadecimal address of a variable.
- \`*\` (Dereference operator) accesses the value stored at the memory location pointed to.

### Stack vs Heap:
- **Stack Memory:** Fast, automatically allocated and freed for local function frames.
- **Heap Memory:** Persists across function calls until explicitly freed using \`free(ptr)\`. Allocated using \`malloc()\`, \`calloc()\`.
`
  },
  {
    id: 'note-ds-linkedlist-1',
    title: 'Singly & Doubly Linked Lists Handout',
    description: 'Visual representations of pointer traversals, edge case handling for empty list and head deletion, code implementation.',
    course: 'B.Tech CSE',
    courseId: 'btech-cse',
    semester: 2,
    subject: 'Data Structures',
    subjectId: 'sub-ds',
    lecture: 'Lecture 3 - Singly & Doubly Linked Lists',
    lectureId: 'lec-ds-3',
    organizationType: 'Lecture',
    fileType: 'PDF',
    fileSize: '4.1 MB',
    pages: 18,
    owner: 'Rahul Kumar',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isOwner: true,
    visibility: 'PUBLIC',
    createdAt: 'Yesterday',
    dateFull: 'Oct 07, 2024',
    views: 204,
    downloads: 65,
    content: `# Singly & Doubly Linked Lists - In-Depth Implementation
## Course: CS201 Data Structures | Semester 2

### 1. Singly Linked List Node Anatomy
\`\`\`c
struct Node {
    int data;
    struct Node* next;
};
\`\`\`

### 2. Time Complexities
| Operation | Array | Singly Linked List |
| :--- | :--- | :--- |
| Insertion at Head | O(N) | **O(1)** |
| Insertion at Tail | O(1) amortized | **O(N)** (or O(1) with tail ptr) |
| Deletion at Head | O(N) | **O(1)** |
| Search by Value | O(N) or O(log N) sorted | **O(N)** |
| Random Index Access | O(1) | **O(N)** |
`
  },
  {
    id: 'note-cpp-oop-1',
    title: 'C++ OOP Complete Notes',
    description: 'Encapsulation, virtual functions, abstract classes, operator overloading, and inheritance hierarchies with diagrams.',
    course: 'BCA',
    courseId: 'bca',
    semester: 2,
    subject: 'Object Oriented Programming',
    subjectId: 'sub-oop',
    lecture: 'Lecture 1 - OOP Foundations',
    lectureId: 'lec-oop-1',
    organizationType: 'General',
    fileType: 'PDF',
    fileSize: '5.2 MB',
    pages: 24,
    owner: 'Rahul Kumar',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isOwner: true,
    visibility: 'PUBLIC',
    createdAt: '4 days ago',
    dateFull: 'Oct 04, 2024',
    views: 312,
    downloads: 98,
    content: `# Complete Object Oriented Programming (C++)
## Principles & Design Patterns

### The 4 Pillars of OOP:
1. **Encapsulation:** Bundling data and methods that operate on that data within a single unit (class) while restricting direct access.
2. **Abstraction:** Displaying only essential features and hiding background details using abstract classes and interfaces.
3. **Inheritance:** Deriving new classes from existing classes to promote code reusability (Single, Multiple, Multilevel, Hierarchical).
4. **Polymorphism:** Ability of an entity to take multiple forms (Compile-time function overloading vs Run-time virtual function dispatch).
`
  },
  {
    id: 'note-math-eigen-1',
    title: 'Eigenvalues & Eigenvectors Cheat Sheet',
    description: 'Fast shortcut methods for 2x2 and 3x3 characteristic equations, Cayley-Hamilton theorem step-by-step verification.',
    course: 'B.Tech CSE',
    courseId: 'btech-cse',
    semester: 1,
    subject: 'Mathematics I',
    subjectId: 'sub-math-1',
    lecture: 'Lecture 2 - Eigenvalues & Eigenvectors',
    lectureId: 'lec-m1-2',
    organizationType: 'Lecture',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    pages: 8,
    owner: 'Ananya Sharma',
    ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    isOwner: false,
    visibility: 'PUBLIC',
    createdAt: '1 week ago',
    dateFull: 'Sep 30, 2024',
    views: 450,
    downloads: 140,
    content: `# Eigenvalues and Eigenvectors Summary
## Characteristic Equation for 3x3 Matrix A:
$$\\lambda^3 - \\text{Tr}(A)\\lambda^2 + (M_{11} + M_{22} + M_{33})\\lambda - \\det(A) = 0$$

Where:
- $\\text{Tr}(A)$ = Sum of principal diagonal elements
- $M_{ii}$ = Minors of principal diagonal elements
- $\\det(A)$ = Determinant of matrix A
`
  },
  {
    id: 'note-dl-boolean-1',
    title: 'Boolean Algebra & K-Map Minimization',
    description: 'Simplification of SOP & POS expressions up to 5 variables, Don’t Care conditions and NAND/NOR gate realization.',
    course: 'B.Tech CSE',
    courseId: 'btech-cse',
    semester: 1,
    subject: 'Digital Logic',
    subjectId: 'sub-digital-logic',
    lecture: 'Lecture 2 - Boolean Algebra',
    lectureId: 'lec-dl-2',
    organizationType: 'Unit',
    fileType: 'PDF',
    fileSize: '2.9 MB',
    pages: 14,
    owner: 'Aditya Verma',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isOwner: false,
    visibility: 'PUBLIC',
    createdAt: '2 weeks ago',
    dateFull: 'Sep 24, 2024',
    views: 380,
    downloads: 110,
    content: `# Boolean Algebra & Karnaugh Maps (K-Maps)
## Basic Theorems:
- **De Morgan’s First Law:** $(A + B)' = A' \\cdot B'$
- **De Morgan’s Second Law:** $(A \\cdot B)' = A' + B'$
- **Consensus Theorem:** $AB + A'C + BC = AB + A'C$
`
  },
  {
    id: 'note-phys-quantum-1',
    title: 'Quantum Mechanics & Wave-Particle Duality',
    description: 'De Broglie hypothesis, Heisenberg uncertainty principle, 1D Schrödinger wave equation derivations.',
    course: 'B.Tech CSE',
    courseId: 'btech-cse',
    semester: 1,
    subject: 'Physics',
    subjectId: 'sub-physics',
    lecture: 'Lecture 4 - Quantum Mechanics',
    lectureId: 'lec-ph-4',
    organizationType: 'Lecture',
    fileType: 'PDF',
    fileSize: '3.1 MB',
    pages: 11,
    owner: 'Pooja Nair',
    ownerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    isOwner: false,
    visibility: 'PUBLIC',
    createdAt: '3 weeks ago',
    dateFull: 'Sep 18, 2024',
    views: 290,
    downloads: 72,
    content: `# Engineering Physics: Quantum Mechanics
## De Broglie Wavelength:
$$\\lambda = \\frac{h}{p} = \\frac{h}{mv} = \\frac{h}{\\sqrt{2mE}}$$
`
  }
];

export const ENROLLED_COURSES = [
  {
    id: 'course-cpp',
    title: 'C++ Programming',
    category: 'Computer Science',
    program: 'BCA & B.Tech Elective',
    description: 'Comprehensive modern C++ covering fundamentals, pointers, object-oriented concepts, STL containers and memory safety.',
    notesCount: 124,
    topicsCount: 18,
    enrolledStudents: 230,
    instructor: 'Prof. David Miller',
    rating: 4.8,
    progressPercentage: 45,
    lastAccessed: '2 hours ago',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
    syllabus: [
      { title: 'C++ Basics & Syntax', notes: 14, topics: 'Variables, datatypes, control flow, functions' },
      { title: 'Object Oriented Programming (OOP)', notes: 22, topics: 'Classes, objects, constructor types, destructor' },
      { title: 'Classes & Objects in Depth', notes: 18, topics: 'Access specifiers, friend functions, static members' },
      { title: 'Inheritance & Ambiguity Resolution', notes: 16, topics: 'Single, multiple, multilevel, virtual base classes' },
      { title: 'Polymorphism & Virtual Functions', notes: 20, topics: 'Function overriding, dynamic dispatch, vtable, pure virtual' },
      { title: 'Standard Template Library (STL)', notes: 24, topics: 'Vectors, lists, maps, iterators, algorithms' },
      { title: 'Exception Handling & File Streams', notes: 10, topics: 'Try-catch blocks, custom exceptions, fstream' }
    ]
  },
  {
    id: 'course-python',
    title: 'Python Programming',
    category: 'Data Science & Development',
    program: 'BCA & B.Tech Elective',
    description: 'Learn modern Python programming from scratch. Covers data structures, functional paradigms, OOP, and file processing.',
    notesCount: 98,
    topicsCount: 14,
    enrolledStudents: 310,
    instructor: 'Dr. Sarah Jenkins',
    rating: 4.9,
    progressPercentage: 65,
    lastAccessed: 'Yesterday',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    syllabus: [
      { title: 'Python Fundamentals', notes: 12, topics: 'Syntax, data types, slicing, operators' },
      { title: 'Built-in Data Structures', notes: 18, topics: 'Lists, tuples, sets, dictionaries, comprehensions' },
      { title: 'Functions & Lambda Expressions', notes: 15, topics: 'Args, kwargs, map, filter, closures, decorators' },
      { title: 'Object-Oriented Python', notes: 20, topics: 'Dunder methods, class methods, multiple inheritance' },
      { title: 'File I/O & JSON Processing', notes: 14, topics: 'Context managers, CSV parsing, serialization' },
      { title: 'Popular Libraries Overview', notes: 19, topics: 'NumPy basics, Pandas DataFrames intro' }
    ]
  },
  {
    id: 'course-webdev',
    title: 'Web Development Foundations',
    category: 'Full Stack Development',
    program: 'Industry Certification Track',
    description: 'Modern front-end and web architecture track: HTML5, semantic markup, responsive CSS, ES6+ JavaScript and component basics.',
    notesCount: 145,
    topicsCount: 22,
    enrolledStudents: 420,
    instructor: 'Alex Rivera',
    rating: 4.9,
    progressPercentage: 30,
    lastAccessed: '3 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    syllabus: [
      { title: 'Semantic HTML & Web Standards', notes: 16, topics: 'Tags, accessibility (ARIA), SEO meta structures' },
      { title: 'Modern CSS & Flexbox/Grid', notes: 25, topics: 'Box model, layout systems, responsive media queries' },
      { title: 'JavaScript Fundamentals', notes: 30, topics: 'DOM manipulation, events, async/await, fetch API' },
      { title: 'Frontend Framework Architecture', notes: 28, topics: 'Components, state, props, lifecycle hooks' },
      { title: 'Web Performance & Security', notes: 18, topics: 'Critical rendering path, CORS, XSS protections' }
    ]
  },
  {
    id: 'course-dbms',
    title: 'Database Management Systems (DBMS)',
    category: 'Database Systems',
    program: 'Core Computer Science',
    description: 'Relational data modeling, ER diagrams, normalization (1NF through BCNF), SQL indexing, and transaction ACID guarantees.',
    notesCount: 110,
    topicsCount: 16,
    enrolledStudents: 280,
    instructor: 'Dr. Michael Chen',
    rating: 4.7,
    progressPercentage: 15,
    lastAccessed: '5 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    syllabus: [
      { title: 'Relational Model & Algebra', notes: 15, topics: 'Tuples, schemas, selection, projection, joins' },
      { title: 'SQL Queries & Subqueries', notes: 24, topics: 'DDL, DML, aggregations, window functions' },
      { title: 'Database Normalization', notes: 20, topics: 'Functional dependencies, 1NF, 2NF, 3NF, BCNF' },
      { title: 'Indexing & B-Trees', notes: 18, topics: 'Clustered vs non-clustered, hash indexes' },
      { title: 'Transactions & Concurrency', notes: 22, topics: 'ACID properties, 2-phase locking, serializability' }
    ]
  }
];

export const ADMIN_STATS = {
  totalStudents: 1420,
  totalCourses: 28,
  totalNotes: 3840,
  totalEnrollments: 890,
  activeToday: 342,
  publicNotes: 2950,
  privateNotes: 890
};

export const RECENT_STUDENTS = [
  { id: 'st-1', name: 'Rahul Kumar', email: 'rahul.kumar@niu.edu.in', course: 'B.Tech CSE', semester: 'Semester 2', joined: 'Oct 02, 2024', status: 'Active' },
  { id: 'st-2', name: 'Ananya Sharma', email: 'ananya.s@niu.edu.in', course: 'B.Tech CSE', semester: 'Semester 1', joined: 'Oct 01, 2024', status: 'Active' },
  { id: 'st-3', name: 'Rohan Mehra', email: 'rohan.m@niu.edu.in', course: 'BCA', semester: 'Semester 3', joined: 'Sep 28, 2024', status: 'Active' },
  { id: 'st-4', name: 'Kavita Iyer', email: 'kavita.i@niu.edu.in', course: 'B.Tech ECE', semester: 'Semester 2', joined: 'Sep 25, 2024', status: 'Active' },
  { id: 'st-5', name: 'Aditya Verma', email: 'aditya.v@niu.edu.in', course: 'MCA', semester: 'Semester 1', joined: 'Sep 20, 2024', status: 'Active' }
];
