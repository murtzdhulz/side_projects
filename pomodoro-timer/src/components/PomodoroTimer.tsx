import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Slider, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import WorkIcon from '@mui/icons-material/Work';
import CoffeeIcon from '@mui/icons-material/Coffee';
import TimerIcon from '@mui/icons-material/Timer';

interface TimerSettings {
  workTime: number;
  shortBreakTime: number;
  longBreakTime: number;
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [settings, setSettings] = useState<TimerSettings>({
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev: number) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === 'work') {
        setCompletedSessions((prev: number) => prev + 1);
        // Auto-switch to appropriate break after work
        const isLongBreak = completedSessions > 0 && completedSessions % 4 === 0;
        setMode(isLongBreak ? 'longBreak' : 'shortBreak');
        setTimeLeft((isLongBreak ? settings.longBreakTime : settings.shortBreakTime) * 60);
      } else {
        // Switch back to work after break
        setMode('work');
        setTimeLeft(settings.workTime * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, settings, completedSessions]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = (): void => {
    setIsRunning(!isRunning);
  };

  const handleReset = (): void => {
    setIsRunning(false);
    setMode('work');
    setCompletedSessions(0);
    setTimeLeft(settings.workTime * 60);
  };

  const handleSettingsChange = (type: keyof TimerSettings, value: number): void => {
    setSettings((prev: TimerSettings) => ({
      ...prev,
      [type]: value,
    }));
    if (!isRunning) {
      if (type === 'workTime' && mode === 'work') {
        setTimeLeft(value * 60);
      } else if (type === 'shortBreakTime' && mode === 'shortBreak') {
        setTimeLeft(value * 60);
      } else if (type === 'longBreakTime' && mode === 'longBreak') {
        setTimeLeft(value * 60);
      }
    }
  };

  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: TimerMode | null
  ): void => {
    if (newMode !== null && !isRunning) {
      setMode(newMode);
      switch (newMode) {
        case 'work':
          setTimeLeft(settings.workTime * 60);
          break;
        case 'shortBreak':
          setTimeLeft(settings.shortBreakTime * 60);
          break;
        case 'longBreak':
          setTimeLeft(settings.longBreakTime * 60);
          break;
      }
    }
  };

  const getModeTitle = (): string => {
    switch (mode) {
      case 'work':
        return 'Work Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return '';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        perspective: '1000px',
      }}
    >
      <Paper
        elevation={24}
        sx={{
          padding: 4,
          borderRadius: 4,
          backgroundColor: '#ffcdd2',
          textAlign: 'center',
          maxWidth: 400,
          width: '100%',
          transform: 'translateZ(20px)',
          boxShadow: `
            0 0 20px rgba(0, 0, 0, 0.1),
            0 0 40px rgba(0, 0, 0, 0.1),
            0 0 60px rgba(0, 0, 0, 0.1)
          `,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateZ(30px)',
            boxShadow: `
              0 0 30px rgba(0, 0, 0, 0.2),
              0 0 50px rgba(0, 0, 0, 0.2),
              0 0 70px rgba(0, 0, 0, 0.2)
            `,
          },
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
            fontWeight: 'bold',
            color: 'black',
          }}
        >
          {getModeTitle()}
        </Typography>
        <Typography 
          variant="h2" 
          gutterBottom 
          color={mode === 'work' ? "error" : "success"}
          sx={{
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.2)',
            fontWeight: 'bold',
            fontSize: '4rem',
            margin: '20px 0',
          }}
        >
          {formatTime(timeLeft)}
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{
            color: 'black',
            mb: 2,
          }}
        >
          Completed Sessions: {completedSessions}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            color={mode === 'work' ? "error" : "success"}
            onClick={handleStartStop}
            startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
            sx={{
              transform: 'translateZ(10px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              backgroundColor: isRunning 
                ? (mode === 'work' ? '#7f0000' : '#004d00')
                : (mode === 'work' ? '#d32f2f' : '#2e7d32'),
              '&:hover': {
                transform: 'translateZ(20px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                backgroundColor: mode === 'work' ? '#b71c1c' : '#1b5e20',
              },
            }}
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleReset}
            startIcon={<RestartAltIcon />}
            sx={{
              transform: 'translateZ(10px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                transform: 'translateZ(20px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            Reset
          </Button>
        </Box>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          aria-label="timer mode"
          sx={{ mb: 4 }}
        >
          <ToggleButton value="work" disabled={isRunning}>
            <WorkIcon sx={{ mr: 1 }} />
            Work
          </ToggleButton>
          <ToggleButton value="shortBreak" disabled={isRunning}>
            <CoffeeIcon sx={{ mr: 1 }} />
            Short Break
          </ToggleButton>
          <ToggleButton value="longBreak" disabled={isRunning}>
            <TimerIcon sx={{ mr: 1 }} />
            Long Break
          </ToggleButton>
        </ToggleButtonGroup>
        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography 
            gutterBottom 
            sx={{
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
              fontWeight: 'bold',
              color: 'black',
            }}
          >
            Work Time: {settings.workTime} minutes
          </Typography>
          <Slider
            value={settings.workTime}
            onChange={(event: Event, value: number | number[]) => handleSettingsChange('workTime', value as number)}
            min={1}
            max={60}
            color="error"
            disabled={isRunning}
            sx={{
              '& .MuiSlider-thumb': {
                boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
              },
            }}
          />
        </Box>
        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography 
            gutterBottom 
            sx={{
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
              fontWeight: 'bold',
              color: 'black',
            }}
          >
            Short Break: {settings.shortBreakTime} minutes
          </Typography>
          <Slider
            value={settings.shortBreakTime}
            onChange={(event: Event, value: number | number[]) => handleSettingsChange('shortBreakTime', value as number)}
            min={1}
            max={15}
            color="success"
            disabled={isRunning}
            sx={{
              '& .MuiSlider-thumb': {
                boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
              },
            }}
          />
        </Box>
        <Box sx={{ width: '100%' }}>
          <Typography 
            gutterBottom 
            sx={{
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
              fontWeight: 'bold',
              color: 'black',
            }}
          >
            Long Break: {settings.longBreakTime} minutes
          </Typography>
          <Slider
            value={settings.longBreakTime}
            onChange={(event: Event, value: number | number[]) => handleSettingsChange('longBreakTime', value as number)}
            min={15}
            max={30}
            color="success"
            disabled={isRunning}
            sx={{
              '& .MuiSlider-thumb': {
                boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default PomodoroTimer; 