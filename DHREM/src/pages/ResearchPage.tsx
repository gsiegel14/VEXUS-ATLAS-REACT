import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Analytics,
  Article,
  Clear,
  ExpandMore,
  Refresh,
  Search,
  TrendingUp,
} from '@mui/icons-material';
import FacultyResearchCard from '../components/FacultyResearchCard';
import {
  currentFaculty,
  currentFellows,
  pastFellows,
  FacultyMember,
} from '../data/facultyData';
import { getAllStaticPublications } from '../data/facultyPublications';
import { GoogleScholarResult, GoogleScholarResponse } from '../types/googleScholar';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`research-tabpanel-${index}`}
      aria-labelledby={`research-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const DEFAULT_QUERY = 'emergency ultrasound OR "emergency ultrasonography"';
const RESULTS_PER_PAGE = 20;
const PER_AUTHOR_LIMIT = 100; // fetch up to 100 per author to improve totals
const DEFAULT_VISIBLE_MEMBERS = 5;
type SortOption =
  | 'year_desc'
  | 'year_asc'
  | 'citations_desc'
  | 'citations_asc'
  | 'title_asc'
  | 'title_desc'
  | 'author_asc'
  | 'author_desc';

const generateFacultyId = (name: string): string => {
  // Normalize spacing and remove punctuation
  const normalized = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  // Drop trailing degree suffixes like -md, -do, -mph, etc., and anything after
  const withoutDegrees = normalized.replace(/-+(md|do|mph|phd|ms|mhs|mba|dnp|rn|np|mpp|mha|dds|dmd)(-.*)?$/i, '');
  // Collapse duplicate hyphens and trim
  return withoutDegrees.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
};

const sortMembers = (members: FacultyMember[]): FacultyMember[] => {
  return [...members].sort((a, b) => a.name.localeCompare(b.name));
};

const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return '';
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:4001';
};

const extractYear = (summary: string | undefined): string => {
  if (!summary) return '';
  const match = summary.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : '';
};

const extractAuthors = (summary: string | undefined): string => {
  if (!summary) return '';
  const parts = summary.split(' - ');
  return parts[0] || '';
};

const canonicalizeName = (name: string): string => {
  if (!name) return '';
  let base = name.split(',')[0];
  base = base.replace(/\./g, ' ');
  const degreeRegex = /^(md|do|mph|phd|ms|mhs|mba|dnp|rn|np|mpp|mha|dds|dmd)$/i;
  base = base
    .split(/\s+/)
    .filter((token) => token && token.length > 1 && !degreeRegex.test(token))
    .join(' ');
  return base.replace(/\s+/g, ' ').trim().toLowerCase();
};

const calculateMetrics = (results: GoogleScholarResult[]) => {
  const totalPublications = results.length;
  const totalCitations = results.reduce(
    (sum, result) => sum + (result.inline_links?.cited_by?.total || 0),
    0,
  );
  const averageCitations = totalPublications > 0
    ? Math.round(totalCitations / totalPublications)
    : 0;

  return {
    totalPublications,
    totalCitations,
    averageCitations,
  };
};

const ResearchPage: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const apiBaseUrl = useMemo(getApiBaseUrl, []);
  const staticGlobalResults = useMemo(() => getAllStaticPublications(), []);

  const [tabValue, setTabValue] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const [globalResults, setGlobalResults] = useState<GoogleScholarResult[]>(
    () => staticGlobalResults,
  );
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState(DEFAULT_QUERY);
  const [yearFilter, setYearFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('year_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [globalMetrics, setGlobalMetrics] = useState(() =>
    calculateMetrics(staticGlobalResults),
  );

  const hasFetchedGlobal = useRef(false);

  const filterStaticPublications = useCallback(
    (query?: string) => {
      if (!query || query.trim().length === 0 || query.trim() === DEFAULT_QUERY) {
        return staticGlobalResults;
      }

      const normalized = query.trim().toLowerCase();
      return staticGlobalResults.filter((result) => {
        const fields = [
          result.title || '',
          result.publication_info?.summary || '',
          result.snippet || '',
          result.matched_author || '',
          ...(result.matched_authors || []),
        ];
        return fields.some((field) => field.toLowerCase().includes(normalized));
      });
    },
    [staticGlobalResults],
  );

  const mergePublications = useCallback(
    (
      primary: GoogleScholarResult[],
      supplemental: GoogleScholarResult[],
    ): GoogleScholarResult[] => {
      if (!supplemental.length) {
        return [...primary];
      }

      const combined: GoogleScholarResult[] = [];
      const seen = new Set<string>();

      const getKey = (item: GoogleScholarResult) => {
        const candidate = (item.link || item.title || item.publication_info?.summary || '').trim().toLowerCase();
        if (candidate) {
          return candidate;
        }
        const authorKey = (item.matched_author || (item.matched_authors && item.matched_authors[0]) || '').toLowerCase();
        return `entry-${authorKey}-${item.position ?? ''}`;
      };

      const addIfNew = (item: GoogleScholarResult) => {
        const key = getKey(item);
        if (key && seen.has(key)) {
          return;
        }
        if (key) {
          seen.add(key);
        }
        combined.push(item);
      };

      primary.forEach(addIfNew);
      supplemental.forEach(addIfNew);

      return combined;
    },
    [],
  );

  const fetchGlobalResults = useCallback(
    async (query?: string, options?: { force?: boolean }) => {
      const searchTerm = query && query.trim().length > 0 ? query.trim() : DEFAULT_QUERY;
      setGlobalLoading(true);
      setGlobalError(null);

      try {
        const params = new URLSearchParams();
        params.set('q', searchTerm);
        params.set('includeAllAuthors', 'true');
        params.set('profilesOnly', 'true');
        params.set('perAuthorLimit', PER_AUTHOR_LIMIT.toString());
        params.set('all', 'true');
        if (options?.force) {
          params.set('force', 'true');
        }

        const endpoint = `${apiBaseUrl}/api/research/all?${params.toString()}`;
        const response = await fetch(endpoint);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || `API request failed: ${response.status}`);
        }

        const data: GoogleScholarResponse = await response.json();
        const apiResults = Array.isArray(data.organic_results) ? data.organic_results : [];
        const staticMatches = filterStaticPublications(searchTerm);
        const combined = mergePublications(apiResults, staticMatches);

        setGlobalResults(combined);
        setGlobalMetrics(calculateMetrics(combined));
        setActiveQuery(searchTerm);
        hasFetchedGlobal.current = true;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch research';
        setGlobalError(message);
        const fallback = filterStaticPublications(searchTerm);
        setGlobalResults(fallback);
        setGlobalMetrics(calculateMetrics(fallback));
        setActiveQuery(searchTerm);
      } finally {
        setGlobalLoading(false);
      }
    },
    [apiBaseUrl, filterStaticPublications, mergePublications],
  );

  useEffect(() => {
    if (tabValue === 0 && !hasFetchedGlobal.current) {
      hasFetchedGlobal.current = true;
      fetchGlobalResults();
    }
  }, [tabValue, fetchGlobalResults]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    fetchGlobalResults(searchQuery, { force: true });
  };

  const handleRefresh = () => {
    fetchGlobalResults(activeQuery, { force: true });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setYearFilter('');
    setAuthorFilter('');
    setSortOption('year_desc');
    setCurrentPage(1);
    fetchGlobalResults(DEFAULT_QUERY, { force: true });
  };

  const allResearchers = useMemo(
    () => [...currentFaculty, ...currentFellows, ...pastFellows],
    [],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [yearFilter, authorFilter, sortOption]);

  const filteredResults = useMemo(() => {
    let items = globalResults;

    if (yearFilter) {
      items = items.filter((result) => extractYear(result.publication_info?.summary) === yearFilter);
    }

    if (authorFilter) {
      const needle = canonicalizeName(authorFilter);
      items = items.filter((result) => {
        const matchedNames = Array.isArray(result.matched_authors) && result.matched_authors.length > 0
          ? result.matched_authors
          : result.matched_author
            ? [result.matched_author]
            : [];
        const summaryAuthors = extractAuthors(result.publication_info?.summary)
          .split(',')
          .map((name) => canonicalizeName(name.trim()))
          .filter(Boolean);
        const candidateNames = [
          ...matchedNames.map(canonicalizeName),
          ...summaryAuthors,
        ].filter(Boolean);
        return candidateNames.some((name) => name.includes(needle));
      });
    }

    const sorted = [...items];
    sorted.sort((a, b) => {
      const yearA = parseInt(extractYear(a.publication_info?.summary), 10) || 0;
      const yearB = parseInt(extractYear(b.publication_info?.summary), 10) || 0;
      const citeA = a.inline_links?.cited_by?.total || 0;
      const citeB = b.inline_links?.cited_by?.total || 0;
      const titleA = (a.title || '').toLowerCase();
      const titleB = (b.title || '').toLowerCase();
      const authorNames = (result: GoogleScholarResult) => {
        const names = Array.isArray(result.matched_authors) && result.matched_authors.length > 0
          ? result.matched_authors
          : result.matched_author
            ? [result.matched_author]
            : [extractAuthors(result.publication_info?.summary)];
        return names.join(', ').toLowerCase();
      };
      const authorA = authorNames(a);
      const authorB = authorNames(b);

      switch (sortOption) {
        case 'year_desc':
          return yearB - yearA;
        case 'year_asc':
          return yearA - yearB;
        case 'citations_desc':
          return citeB - citeA;
        case 'citations_asc':
          return citeA - citeB;
        case 'title_asc':
          return titleA.localeCompare(titleB);
        case 'title_desc':
          return titleB.localeCompare(titleA);
        case 'author_asc':
          return authorA.localeCompare(authorB);
        case 'author_desc':
          return authorB.localeCompare(authorA);
        default:
          return 0;
      }
    });

    return sorted;
  }, [globalResults, yearFilter, authorFilter, sortOption]);

  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    return filteredResults.slice(startIndex, startIndex + RESULTS_PER_PAGE);
  }, [filteredResults, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / RESULTS_PER_PAGE));

  const yearOptions = useMemo(() => {
    const set = new Set<string>();
    globalResults.forEach((result) => {
      const year = extractYear(result.publication_info?.summary);
      if (year) {
        set.add(year);
      }
    });
    const years = Array.from(set);
    years.sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
    return years;
  }, [globalResults]);

  const authorOptions = useMemo(() => {
    const canonToDisplay = new Map<string, string>();
    allResearchers.forEach((person) => {
      const canonical = canonicalizeName(person.name);
      if (!canonical) return;
      const candidate = person.name.split(',')[0].trim();
      const existing = canonToDisplay.get(canonical);
      if (!existing || candidate.length < existing.length) {
        canonToDisplay.set(canonical, candidate);
      }
    });

    return Array.from(canonToDisplay.values()).sort((a, b) => a.localeCompare(b));
  }, [allResearchers]);

  const prioritizeMembers = useCallback((members: FacultyMember[], priorityNames: string[]): FacultyMember[] => {
    const lower = new Set(priorityNames.map((n) => n.toLowerCase()));
    const prioritized: FacultyMember[] = [];
    for (const name of priorityNames) {
      const m = members.find((mm) => mm.name.toLowerCase() === name.toLowerCase());
      if (m) prioritized.push(m);
    }
    const rest = members.filter((m) => !lower.has(m.name.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));
    return [...prioritized, ...rest];
  }, []);

  const pastFellowsOrdered = useMemo(() => {
    return prioritizeMembers(pastFellows, ['Gabriel Siegel, MD', 'Peter Alsharif, MD']);
  }, [pastFellows, prioritizeMembers]);

  const facultyAndFellowsOrdered = useMemo(() => {
    const prioritizedNames = ['Samuel H. F. Lam, MD, MPH', 'Michael Heffler, MD'];
    return prioritizeMembers(currentFaculty, prioritizedNames);
  }, [currentFaculty, prioritizeMembers]);

  const researchGroups = useMemo(
    () => [
      { title: 'Faculty and Fellows', members: facultyAndFellowsOrdered },
      { title: 'Current Fellows', members: sortMembers(currentFellows) },
      { title: 'Past Fellows', members: pastFellowsOrdered },
    ],
    [facultyAndFellowsOrdered, currentFellows, pastFellowsOrdered],
  );

  const hasResearchers = researchGroups.some((group) => group.members.length > 0);

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: 'grey.900',
          color: 'white',
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 2,
            }}
          >
            Research Library
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'grey.300',
              maxWidth: 720,
              mx: 'auto',
            }}
          >
            Explore our DH US publication feed or dive into individual faculty and fellow Google Scholar profiles.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isSmallScreen ? 'scrollable' : 'standard'}
          aria-label="research view tabs"
        >
          <Tab label="DH US PUBLICATION" id="research-tab-0" aria-controls="research-tabpanel-0" />
          <Tab label="By Author" id="research-tab-1" aria-controls="research-tabpanel-1" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={1}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Article sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {globalMetrics.totalPublications}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Publications
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={1}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <TrendingUp sx={{ fontSize: 36, color: 'success.main', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {globalMetrics.totalCitations}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Citations
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={1}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Analytics sx={{ fontSize: 36, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {globalMetrics.averageCitations}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Citations
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              mb: 3,
              alignItems: { xs: 'stretch', md: 'center' },
            }}
          >
            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 140 }} size="small">
              <InputLabel id="year-filter-label">Year</InputLabel>
              <Select
                labelId="year-filter-label"
                label="Year"
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value)}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="author-filter-label">Author</InputLabel>
              <Select
                labelId="author-filter-label"
                label="Author"
                value={authorFilter}
                onChange={(event) => setAuthorFilter(event.target.value)}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {authorOptions.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel id="sort-option-label">Sort By</InputLabel>
              <Select
                labelId="sort-option-label"
                label="Sort By"
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value as SortOption)}
              >
                <MenuItem value="year_desc">Newest First</MenuItem>
                <MenuItem value="year_asc">Oldest First</MenuItem>
                <MenuItem value="citations_desc">Most Cited</MenuItem>
                <MenuItem value="citations_asc">Least Cited</MenuItem>
                <MenuItem value="title_asc">Title A-Z</MenuItem>
                <MenuItem value="title_desc">Title Z-A</MenuItem>
                <MenuItem value="author_asc">Author A-Z</MenuItem>
                <MenuItem value="author_desc">Author Z-A</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleSearchSubmit}
                startIcon={<Search fontSize="small" />}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleRefresh}
                startIcon={<Refresh fontSize="small" />}
              >
                Refresh
              </Button>
              <Button
                variant="text"
                color="inherit"
                onClick={handleClearFilters}
                startIcon={<Clear fontSize="small" />}
              >
                Clear
              </Button>
            </Box>
          </Box>

          {globalLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {!globalLoading && globalError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {globalError}
            </Alert>
          )}

          {!globalLoading && !globalError && paginatedResults.length === 0 && (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No publications found for the selected filters.
            </Typography>
          )}

          {!globalLoading && !globalError && paginatedResults.length > 0 && (
            <>
               <TableContainer component={Paper} elevation={1}>
                 <Table size="small">
                  <TableHead>
                    <TableRow>
                       <TableCell sx={{ fontWeight: 600, width: '70%' }}>Title & Summary</TableCell>
                       <TableCell sx={{ fontWeight: 600, width: '10%' }}>Year</TableCell>
                       <TableCell sx={{ fontWeight: 600, width: '10%' }}>Citations</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                     {paginatedResults.map((result, index) => {
                      const year = extractYear(result.publication_info?.summary);
                      const citations = result.inline_links?.cited_by?.total ?? 0;

                      return (
                        <TableRow key={`${result.position}-${index}`} hover>
                          <TableCell>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {result.link ? (
                                <Link
                                  href={result.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{ textDecoration: 'none', color: 'primary.main' }}
                                >
                                  {result.title}
                                </Link>
                              ) : (
                                result.title
                              )}
                            </Typography>
                            {result.publication_info?.summary && (
                              <Typography variant="caption" color="text.secondary">
                                {result.publication_info.summary}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {year}
                          </TableCell>
                          <TableCell>
                            {citations > 0 ? (
                              <Chip label={`${citations}`} size="small" color="primary" variant="outlined" />
                            ) : (
                              <Typography variant="caption" color="text.secondary">
                                —
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_event, value) => setCurrentPage(value)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {!hasResearchers ? (
            <Typography variant="body1" align="center" color="text.secondary">
              Research profiles are being updated. Please check back soon.
            </Typography>
          ) : (
            <>
              {researchGroups.map((group) =>
                group.members.length > 0 ? (
                  <Box key={group.title} sx={{ mb: { xs: 4, md: 6 } }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: { xs: 2, md: 3 },
                        textAlign: isSmallScreen ? 'center' : 'left',
                      }}
                    >
                      {group.title}
                    </Typography>

                    {(() => {
                      const allMembers = group.members;
                      const isExpanded = expandedGroups[group.title] ?? false;
                      const visibleMembers = isExpanded
                        ? allMembers
                        : allMembers.slice(0, DEFAULT_VISIBLE_MEMBERS);
                      const shouldShowToggle = allMembers.length > DEFAULT_VISIBLE_MEMBERS;
                      const remainingCount = Math.max(allMembers.length - visibleMembers.length, 0);

                      return (
                        <>
                          <Grid
                            container
                            spacing={isSmallScreen ? 2 : 3}
                            alignItems="stretch"
                            justifyContent="flex-start"
                          >
                            {visibleMembers.map((member, index) => {
                              const facultyId = member.id?.trim() || generateFacultyId(member.name);
                              const isLastOdd = visibleMembers.length % 2 === 1 && index === visibleMembers.length - 1;
                              return (
                                <Grid
                                  item
                                  key={facultyId}
                                  xs={12}
                                  sm={isLastOdd ? 12 : 6}
                                  md={isLastOdd ? 12 : 6}
                                  sx={{ display: 'flex' }}
                                >
                                  <FacultyResearchCard
                                    facultyId={facultyId}
                                    facultyName={member.name}
                                    facultyTitle={member.title}
                                    imageUrl={member.imageUrl}
                                    compact={false}
                                    cardSx={{ width: '100%' }}
                                  />
                                </Grid>
                              );
                            })}
                          </Grid>

                          {shouldShowToggle && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                              <Button
                                variant="text"
                                color="primary"
                                endIcon={
                                  <ExpandMore
                                    sx={{
                                      transform: isExpanded ? 'rotate(180deg)' : 'none',
                                      transition: 'transform 0.2s ease',
                                    }}
                                  />
                                }
                                onClick={() =>
                                  setExpandedGroups((prev) => ({
                                    ...prev,
                                    [group.title]: !isExpanded,
                                  }))
                                }
                              >
                                {isExpanded
                                  ? 'Show Less'
                                  : `Show ${remainingCount} More`}
                              </Button>
                            </Box>
                          )}
                        </>
                      );
                    })()}
                  </Box>
                ) : null,
              )}
            </>
          )}
        </TabPanel>
      </Container>
    </Box>
  );
};

export default ResearchPage;
