
// Every server component inside this folder can access the params
const CourseIdPage = ({
    params
} : {
    params: { courseId: string }
}) => {
  return (
    <div>
        Course Id Page: {params.courseId}
    </div>
  )
}

export default CourseIdPage