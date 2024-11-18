import subprocess
import os
import time
from pyngrok import ngrok
import dotenv

def deploy():
    try:
        # Start frontend in background
        frontend_process = subprocess.Popen(
            "npm run dev",
            shell=True,
            cwd="frontend"
        )
        
        # Start backend in background
        backend_process = subprocess.Popen(
            "npm run dev", 
            shell=True,
            cwd="backend"
        )
        
        # Allow servers to start
        time.sleep(5)
        
        # Start ngrok tunnel to backend (assuming backend runs on 3000)
        ngrok_tunnel = ngrok.connect(3001)
        ngrok_url = ngrok_tunnel.public_url
        
        # Update frontend .env file with ngrok URL
        env_path = os.path.join("frontend", ".env")
        with open(env_path, "r") as f:
            env_content = f.read()
            
        new_env = env_content.replace(
            f"PUBLIC_BASE_URL=http://localhost:3000",
            f"PUBLIC_BASE_URL={ngrok_url}"
        )
        
        with open(env_path, "w") as f:
            f.write(new_env)
            
        print(f"Deployment successful!")
        print(f"Frontend running on http://localhost:3001")
        print(f"Backend exposed at: {ngrok_url}")
        
        # Keep script running
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            frontend_process.terminate()
            backend_process.terminate()
            ngrok.kill()
            
    except Exception as e:
        print(f"Deployment failed: {str(e)}")
        # Cleanup
        if 'frontend_process' in locals():
            frontend_process.terminate()
        if 'backend_process' in locals():
            backend_process.terminate()
        ngrok.kill()