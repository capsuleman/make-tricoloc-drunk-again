import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';
import { Title, Container } from './BetChart.style';

import client from 'src/services/networking/client';
import { colors } from 'src/theme';

interface ChartDatum {
  id: string;
  name: string;
  data: { time: number; cumulatedValue: number }[];
}

interface CustomizedAxisTickProps {
  x: number;
  y: number;
  payload: { value: number };
}

const CustomizedAxisTick: React.FC<CustomizedAxisTickProps> = ({ x, y, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <text x={0} y={0} dy={16} fill="#666">
      <tspan textAnchor="middle" x="0">
        {new Date(payload.value / 1000).toLocaleDateString()}
      </tspan>
      <tspan textAnchor="middle" x="0" dy="20">
        {new Date(payload.value / 1000).toLocaleTimeString()}
      </tspan>
    </text>
  </g>
);

const BetChart: React.FC = () => {
  const theme = useTheme();
  const [chartData, setChartData] = React.useState<ChartDatum[]>([]);

  React.useEffect(() => {
    client.getChartBetData().then((chartData: ChartDatum[]) => setChartData(chartData));
  }, []);

  const options = chartData.map(({ id, name }) => ({ id, name }));
  const betsWithOptionId = chartData
    .flatMap(({ id, data }) =>
      data.map(({ time, cumulatedValue }) => ({ time, cumulatedValue, id })),
    )
    .sort((a, b) => a.time - b.time);

  const timestamps = betsWithOptionId
    .map(({ time }) => time)
    .filter((value, index, array) => array.indexOf(value) === index);

  const lastValue: { [id: string]: number } = {};
  const data = timestamps.map((timestamp) => {
    const dataAtTime: { [id: string]: number | undefined } = { time: timestamp };
    options.forEach(({ id }) => (dataAtTime[id] = lastValue[id]));
    betsWithOptionId
      .filter(({ time }) => time === timestamp)
      .forEach((bet) => {
        dataAtTime[bet.id] = bet.cumulatedValue;
        lastValue[bet.id] = bet.cumulatedValue;
      });
    return dataAtTime;
  });
  data.push({ time: new Date().getTime() * 1000, ...lastValue });

  const lineColors = [colors.orange, colors.darkBlue, colors.red, colors.grey];

  return (
    <Container>
      <Title>History</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 16,
            left: 24,
          }}
        >
          <XAxis
            dataKey="time"
            domain={['dataMin', new Date().getTime()]}
            stroke={theme.palette.text.primary}
            tick={CustomizedAxisTick}
            type="number"
          />
          <YAxis stroke={theme.palette.text.primary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Number of shots bet
            </Label>
          </YAxis>
          <Tooltip labelFormatter={(time) => new Date((time as number) / 1000).toLocaleString()} />
          {options.map((option, index) => {
            return (
              <Line
                type="stepAfter"
                dataKey={option.id}
                stroke={lineColors[index]}
                dot={false}
                name={option.name}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default BetChart;
