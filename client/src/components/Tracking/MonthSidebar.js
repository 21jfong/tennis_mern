import React, { useState } from "react";
import { Box, Typography, Paper, Tooltip, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton as MuiIconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import dayjs from "dayjs";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MonthSidebar = ({ monthStats, selectedDate, onSelectDate }) => {
  const [viewMonth, setViewMonth] = useState(selectedDate.startOf('month'));
  // Copy month stats as formatted text to clipboard
  const handleCopyMonth = () => {
    const daysInMonth = dayjs(selectedDate).daysInMonth();
    const monthStart = dayjs(selectedDate).startOf("month");
  let tsv = 'Date\tN\tS\n';
        for (let d = 1; d <= daysInMonth; d++) {
          const date = monthStart.date(d);
          const dateLabel = date.format("MMM D");
          const dateStr = date.format("YYYY-MM-DD");
          const stats = monthStats[dateStr] || {};
          const nVal = stats.stat1 === undefined || stats.stat1 === '' ? '0' : stats.stat1;
          const sVal = stats.stat2 === undefined || stats.stat2 === '' ? '0' : stats.stat2;
          tsv += `${dateLabel}\t${nVal}\t${sVal}\n`;
        }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(tsv);
    } else {
      // fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = tsv;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };
  const daysInMonth = viewMonth.daysInMonth();
  const monthStart = viewMonth;
  const firstDayOfWeek = monthStart.day();
  const today = dayjs();

  // Build a 2D array for the calendar grid
  const calendar = [];
  let week = Array(firstDayOfWeek).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = monthStart.date(d);
    week.push(date);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }
  if (week.length) calendar.push(week.concat(Array(7 - week.length).fill(null)));

  return (
  <Paper elevation={2} sx={{ p: 2, minWidth: 220, maxWidth: 260, maxHeight: 500, overflowY: "auto" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <MuiIconButton size="small" onClick={() => setViewMonth(viewMonth.subtract(1, 'month'))}>
          <ArrowBackIosNewIcon fontSize="small" />
        </MuiIconButton>
        <Typography variant="h6" align="center" gutterBottom sx={{ mb: 0, flexGrow: 1 }}>
          {monthStart.format("MMMM YYYY")}
        </Typography>
        <MuiIconButton size="small" onClick={() => setViewMonth(viewMonth.add(1, 'month'))}>
          <ArrowForwardIosIcon fontSize="small" />
        </MuiIconButton>
        <Button size="small" variant="contained" color="primary" onClick={handleCopyMonth} sx={{ ml: 1, color: '#fff', fontWeight: 600, minWidth: 90, boxShadow: 1 }}>
          Copy CSV
        </Button>
      </Box>
      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={0.5} mb={1}>
        {daysOfWeek.map((dow) => (
          <Typography key={dow} variant="caption" align="center" sx={{ fontWeight: 600 }}>
            {dow}
          </Typography>
        ))}
      </Box>
      {calendar.map((week, i) => (
        <Box key={i} display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={0.5}>
          {week.map((date, j) => {
            if (!date) return <Box key={j} sx={{ height: 32 }} />;
            const dateStr = date.format("YYYY-MM-DD");
            const stats = monthStats[dateStr] || {};
            const isSelected = date.isSame(selectedDate, "day");
            const isToday = date.isSame(today, "day");
            return (
              <Tooltip
                key={dateStr}
                title={
                  stats.stat1 || stats.stat2
                    ? `S1: ${stats.stat1 || "-"}, S2: ${stats.stat2 || "-"}`
                    : "No data"
                }
                arrow
                placement="top"
              >
                <Box
                  onClick={() => onSelectDate(date)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 1,
                    bgcolor: isSelected && date.isSame(viewMonth, 'month')
                      ? (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#bbdefb'
                      : 'transparent',
                    color: isSelected && date.isSame(viewMonth, 'month') ? '#222' : undefined,
                    border: isToday && date.isSame(viewMonth, 'month') ? '1.5px solid #1976d2' : undefined,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: isSelected && date.isSame(viewMonth, 'month') ? 700 : 400,
                    fontSize: 15,
                    transition: 'background 0.2s',
                    '&:hover': {
                      bgcolor: isSelected && date.isSame(viewMonth, 'month') ? '#64b5f6' : 'grey.100',
                    },
                  }}
                >
                  {date.date()}
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      ))}
      <Box mt={2}>
        <Typography variant="subtitle2" align="center" gutterBottom>
          Month Overview
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, p: 0.5 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700, p: 0.5 }}>N</TableCell>
                <TableCell sx={{ fontWeight: 700, p: 0.5 }}>S</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(() => {
                let rows = [];
                for (let d = 1; d <= daysInMonth; d++) {
                  const date = monthStart.date(d);
                  const dateStr = date.format("YYYY-MM-DD");
                  const stats = monthStats[dateStr] || {};
                  rows.push(
                    <TableRow key={dateStr} selected={date.isSame(selectedDate, 'day')} sx={{ cursor: 'pointer' }} onClick={() => onSelectDate(date)}>
                      <TableCell sx={{ p: 0.5 }}>{date.format("MMM D")}</TableCell>
                      <TableCell sx={{ p: 0.5 }}>{stats.stat1 || '-'}</TableCell>
                      <TableCell sx={{ p: 0.5 }}>{stats.stat2 || '-'}</TableCell>
                    </TableRow>
                  );
                }
                return rows;
              })()}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default MonthSidebar;
