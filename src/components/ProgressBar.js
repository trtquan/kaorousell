import { useProgress } from '../hooks'

const ProgressBar = ({ animate, time }) => {
  let progress = useProgress(animate, time);

  return (
    <div className="ProgressBar">
      <div style={{ width: `${progress * 100}%` }} />
    </div>
  );
}

export default ProgressBar;