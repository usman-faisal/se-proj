export default function Icon({ text, ...props }: { text: string }) {
    return (
        <svg width="auto" height="225" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="225" fill="#cccccc"/>
  <text x="50%" y="50%" fontFamily="Arial, sans-serif" fontSize="24" fill="#666666" textAnchor="middle" dy=".3em">{text}</text>
</svg>
    )
}
