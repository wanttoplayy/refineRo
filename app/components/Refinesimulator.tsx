"use client"
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { refineData } from '../utils/refineData';

export const RefineSimulator = () => {
  const [currentLevel, setCurrentLevel] = useState(4);
  const [targetLevel, setTargetLevel] = useState(13);
  const [coinsSpent, setCoinsSpent] = useState(4);
  const [isRefining, setIsRefining] = useState(false);
  const [refineResult, setRefineResult] = useState<'success' | 'fail' | null>(null);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);

  useEffect(() => {
    const storedData = localStorage.getItem('refineSimulatorData');
    if (storedData) {
      const { currentLevel, targetLevel, coinsSpent, consecutiveFailures } = JSON.parse(storedData);
      setCurrentLevel(currentLevel);
      setTargetLevel(targetLevel);
      setCoinsSpent(coinsSpent);
      setConsecutiveFailures(consecutiveFailures);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'refineSimulatorData',
      JSON.stringify({ currentLevel, targetLevel, coinsSpent, consecutiveFailures })
    );
  }, [currentLevel, targetLevel, coinsSpent, consecutiveFailures]);

  const handleRefine = () => {
    setIsRefining(true);
    const { successRate, boosterCoins } = refineData.find(
      (entry) => entry.level === currentLevel
    )!;

    const isSuccessful = Math.random() * 100 < successRate;

    setTimeout(() => {
      setRefineResult(isSuccessful ? 'success' : 'fail');
      setCoinsSpent((prevCoins) => prevCoins + boosterCoins);

      if (isSuccessful) {
        setCurrentLevel((prevLevel) => prevLevel + 1);
        setConsecutiveFailures(0);
      } else {
        setConsecutiveFailures((prevFailures) => prevFailures + 1);
      }

      setIsRefining(false);
    }, 1000);
  };

  const handleReset = () => {
    setCurrentLevel(4);
    setTargetLevel(13);
    setCoinsSpent(4);
    setConsecutiveFailures(0);
    setRefineResult(null);
    localStorage.removeItem('refineSimulatorData');
  };

  const getRefineMessage = (result: 'success' | 'fail') => {
    if (result === 'success') {
      return 'ติดไปดิ';
    } else {
      if (consecutiveFailures >= 15) {
        return 'พอสัดเลิก';
      } else if (consecutiveFailures >= 10) {
        return 'แม่มเย็ด';
      } else if (consecutiveFailures >= 5) {
        return 'คว..............................';
      } else {
        return 'แหกแม้งเอ้ย';
      }
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Refining Simulation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="number"
            min={4}
            value={currentLevel}
            readOnly
            label="Current Level"
          />
          <Input
            type="number"
            min={currentLevel + 1}
            max={13}
            value={targetLevel}
            onChange={(e) => setTargetLevel(parseInt(e.target.value))}
            label="Target Level"
          />
          <div className="flex space-x-4">
            <Button
              onClick={handleRefine}
              disabled={isRefining || currentLevel >= targetLevel}
              variant="default"
              size="lg"
              className="w-full"
            >
              {isRefining ? 'Refining...' : 'Refine'}
            </Button>
            <Button
              onClick={handleReset}
              variant="destructive"
              size="lg"
              className="w-full"
            >
              Reset
            </Button>
          </div>
          <p>ใช้ Booster Coins ไปแล้ว : {coinsSpent}</p>
          {currentLevel >= targetLevel && (
            <p>Congratulations! You reached level {targetLevel}.</p>
          )}
          {refineResult && (
            <Alert
              variant={refineResult === 'success' ? 'success' : 'destructive'}
              className="max-w-md mx-auto"
            >
              <AlertTitle className={refineResult === 'success' ? 'text-green-500' : 'text-red-500'}>
                Refine Result
              </AlertTitle>
              <AlertDescription className={refineResult === 'success' ? 'text-green-500' : 'text-red-500'}>
                {getRefineMessage(refineResult)}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};