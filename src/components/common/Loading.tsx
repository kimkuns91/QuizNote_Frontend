import Lottie from 'lottie-react';
import loadingAnimation from '../../../public/assets/loading_dot.json';

interface LoadingProps {
  size?: number;
}

const Loading = ({ size }: LoadingProps) => {
  return (
    <Lottie animationData={loadingAnimation} autoplay loop style={{ width: size, height: size }} />
  );
};

export default Loading;