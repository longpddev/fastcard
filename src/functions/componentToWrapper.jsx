export default function componentToWrapper (Parent, Children) {
  return () => (
    <Parent>
      <Children></Children>
    </Parent>
  )
}