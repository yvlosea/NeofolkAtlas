-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
-- AutoEdu Supabase Schema
-- Regulated Intellectual Social Network + Portfolio Engine
-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
-- USER PROFILES & REPUTATION
-- ⸻⸻⸻⸻⸸⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

CREATE TABLE autoedu_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Info
    display_name TEXT,
    bio TEXT,
    location TEXT,
    age INTEGER CHECK (age >= 0 AND age <= 120),
    
    -- Reputation Scores
    credibility INTEGER DEFAULT 10 CHECK (credibility >= 0 AND credibility <= 100),
    total_works INTEGER DEFAULT 0,
    total_citations INTEGER DEFAULT 0,
    total_references INTEGER DEFAULT 0,
    total_bookmarks INTEGER DEFAULT 0,
    arbiter_endorsements INTEGER DEFAULT 0,
    
    -- Composite Scores (calculated)
    neoscore INTEGER DEFAULT 0,
    neoscore_breakdown JSONB DEFAULT '{}',
    
    -- Specialization
    primary_domain TEXT,
    specscore INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Index for leaderboard queries
CREATE INDEX idx_autoedu_profiles_neoscore ON autoedu_profiles(neoscore DESC);
CREATE INDEX idx_autoedu_profiles_credibility ON autoedu_profiles(credibility DESC);
CREATE INDEX idx_autoedu_profiles_domain ON autoedu_profiles(primary_domain);

-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
-- SUBMISSIONS (Portfolio Works)
-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

CREATE TABLE autoedu_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Categorization
    type TEXT NOT NULL CHECK (type IN (
        'article', 'essay', 'research',
        'project', 'prototype', 'experiment',
        'artifact', 'community_work', 'social_contribution',
        'certification', 'pathway', 'module',
        'internal_pub', 'external_pub', 'featured'
    )),
    category TEXT NOT NULL CHECK (category IN ('work', 'build', 'impact', 'academic', 'publication')),
    domain TEXT NOT NULL,
    
    -- Content
    title TEXT NOT NULL,
    abstract TEXT,
    content TEXT,
    word_count INTEGER DEFAULT 0,
    external_link TEXT,
    tags TEXT[] DEFAULT '{}',
    
    -- File attachments
    file_urls TEXT[] DEFAULT '{}',
    thumbnail_url TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'featured')),
    
    -- Scores (Layer 1: Self)
    self_score INTEGER DEFAULT 0,
    
    -- Scores (Layer 2: Community)
    community_rating DECIMAL(2,1) DEFAULT 0 CHECK (community_rating >= 0 AND community_rating <= 5),
    community_ratings_count INTEGER DEFAULT 0,
    citations INTEGER DEFAULT 0,
    bookmarks INTEGER DEFAULT 0,
    references INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    
    -- Scores (Layer 3: Arbiter)
    arbiter_approved BOOLEAN DEFAULT FALSE,
    arbiter_id UUID REFERENCES auth.users(id),
    arbiter_notes TEXT,
    originality_score INTEGER CHECK (originality_score >= 0 AND originality_score <= 10),
    
    -- Calculated total score
    total_score DECIMAL(10,2) DEFAULT 0,
    
    -- Featured status
    featured BOOLEAN DEFAULT FALSE,
    featured_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Search
    search_vector tsvector
);

-- Indexes for performance
CREATE INDEX idx_autoedu_submissions_user_id ON autoedu_submissions(user_id);
CREATE INDEX idx_autoedu_submissions_status ON autoedu_submissions(status);
CREATE INDEX idx_autoedu_submissions_category ON autoedu_submissions(category);
CREATE INDEX idx_autoedu_submissions_domain ON autoedu_submissions(domain);
CREATE INDEX idx_autoedu_submissions_type ON autoedu_submissions(type);
CREATE INDEX idx_autoedu_submissions_created_at ON autoedu_submissions(created_at DESC);
CREATE INDEX idx_autoedu_submissions_total_score ON autoedu_submissions(total_score DESC);
CREATE INDEX idx_autoedu_submissions_featured ON autoedu_submissions(featured) WHERE featured = TRUE;
CREATE INDEX idx_autoedu_submissions_arbiter ON autoedu_submissions(arbiter_approved) WHERE arbiter_approved = TRUE;

-- Full-text search index
CREATE INDEX idx_autoedu_submissions_search ON autoedu_submissions USING GIN(search_vector);

-- Trigger to update search vector
CREATE OR REPLACE FUNCTION update_submission_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.abstract, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_search_vector
    BEFORE INSERT OR UPDATE ON autoedu_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_submission_search_vector();

-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
-- COMMUNITY RATINGS (Layer 2)
-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

CREATE TABLE autoedu_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES autoedu_submissions(id) ON DELETE CASCADE,
    rater_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(submission_id, rater_id) -- One rating per user per submission
);

CREATE INDEX idx_autoedu_ratings_submission ON autoedu_ratings(submission_id);
CREATE INDEX idx_autoedu_ratings_rater ON autoedu_ratings(rater_id);

-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
-- ARBITER REVIEWS (Layer 3)
-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

CREATE TABLE autoedu_arbiter_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES autoedu_submissions(id) ON DELETE CASCADE,
    arbiter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    decision TEXT NOT NULL CHECK (decision IN ('approve', 'reject')),
    notes TEXT,
    originality_score INTEGER CHECK (originality_score >= 0 AND originality_score <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(submission_id)
);

CREATE INDEX idx_autoedu_reviews_submission ON autoedu_arbiter_reviews(submission_id);
CREATE INDEX idx_autoedu_reviews_arbiter ON autoedu_arbiter_reviews(arbiter_id);

-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
-- ENGAGEMENTS (Bookmarks, Citations, References)
-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

CREATE TABLE autoedu_engagements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES autoedu_submissions(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('bookmark', 'cite', 'reference', 'view')),
    metadata JSONB DEFAULT '{}', -- For citations: can store context
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, submission_id, action)
);

CREATE INDEX idx_autoedu_engagements_user ON autoedu_engagements(user_id);
CREATE INDEX idx_autoedu_engagements_submission ON autoedu_engagements(submission_id);
CREATE INDEX idx_autoedu_engagements_action ON autoedu_engagements(action);

-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
-- COMMENTS
-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

CREATE TABLE autoedu_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES autoedu_submissions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES autoedu_comments(id) ON DELETE CASCADE, -- For nested comments
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_autoedu_comments_submission ON autoedu_comments(submission_id);
CREATE INDEX idx_autoedu_comments_user ON autoedu_comments(user_id);
CREATE INDEX idx_autoedu_comments_parent ON autoedu_comments(parent_id);

-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
-- MONTHLY SUBMISSION TRACKING (For Caps)
-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

CREATE TABLE autoedu_monthly_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    
    -- Category counts
    work_count INTEGER DEFAULT 0,
    build_count INTEGER DEFAULT 0,
    impact_count INTEGER DEFAULT 0,
    academic_count INTEGER DEFAULT 0,
    publication_count INTEGER DEFAULT 0,
    
    -- Type-specific counts (stored as JSONB for flexibility)
    type_counts JSONB DEFAULT '{}',
    
    total_score DECIMAL(10,2) DEFAULT 0,
    
    UNIQUE(user_id, year, month)
);

CREATE INDEX idx_autoedu_monthly_stats_user ON autoedu_monthly_stats(user_id);
CREATE INDEX idx_autoedu_monthly_stats_period ON autoedu_monthly_stats(year, month);

-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
-- GALLERY CURATIONS
-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

CREATE TABLE autoedu_galleries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gallery_type TEXT NOT NULL CHECK (gallery_type IN (
        'best_research', 'best_visual', 'best_impact', 'emerging', 'young_researchers'
    )),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    submission_id UUID REFERENCES autoedu_submissions(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL, -- Position in gallery (1, 2, 3...)
    curated_by UUID REFERENCES auth.users(id), -- Arbiter who selected it
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(gallery_type, year, month, rank)
);

CREATE INDEX idx_autoedu_galleries_type_period ON autoedu_galleries(gallery_type, year, month);
CREATE INDEX idx_autoedu_galleries_submission ON autoedu_galleries(submission_id);

-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
-- FUNCTIONS & TRIGGERS
-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

-- Function to calculate submission score
CREATE OR REPLACE FUNCTION calculate_submission_score(
    p_base_score INTEGER,
    p_weight DECIMAL,
    p_community_rating DECIMAL,
    p_citations INTEGER,
    p_bookmarks INTEGER,
    p_references INTEGER,
    p_arbiter_approved BOOLEAN
) RETURNS DECIMAL AS $$
DECLARE
    v_score DECIMAL;
    v_multiplier DECIMAL := 1.0;
    v_max_score DECIMAL;
BEGIN
    -- Community rating multiplier
    IF p_community_rating >= 4 THEN
        v_multiplier := 1.5;
    ELSIF p_community_rating = 3 THEN
        v_multiplier := 1.2;
    ELSIF p_community_rating <= 2 AND p_community_rating > 0 THEN
        v_multiplier := 0.8;
    END IF;
    
    -- Base score with weight and multiplier
    v_score := p_base_score * p_weight * v_multiplier;
    
    -- Engagement bonuses
    v_score := v_score + (p_citations * 2.0);
    v_score := v_score + (p_bookmarks * 1.1);
    v_score := v_score + (p_references * 1.3);
    
    -- Arbiter approval bonus
    IF p_arbiter_approved THEN
        v_score := v_score * 2.0;
    END IF;
    
    -- Cap at 4x max
    v_max_score := p_base_score * p_weight * 4;
    RETURN LEAST(v_score, v_max_score);
END;
$$ LANGUAGE plpgsql;

-- Function to update submission score when ratings change
CREATE OR REPLACE FUNCTION recalculate_submission_score()
RETURNS TRIGGER AS $$
DECLARE
    v_base INTEGER;
    v_weight DECIMAL;
BEGIN
    -- Get base score and weight from type lookup
    -- These would be in a lookup table or hardcoded
    SELECT 
        CASE NEW.type
            WHEN 'article' THEN 2
            WHEN 'essay' THEN 2
            WHEN 'research' THEN 3
            WHEN 'project' THEN 5
            WHEN 'prototype' THEN 5
            WHEN 'experiment' THEN 4
            WHEN 'artifact' THEN 8
            WHEN 'community_work' THEN 6
            WHEN 'social_contribution' THEN 7
            WHEN 'certification' THEN 1
            WHEN 'pathway' THEN 2
            WHEN 'module' THEN 1
            WHEN 'internal_pub' THEN 15
            WHEN 'external_pub' THEN 12
            WHEN 'featured' THEN 20
        END,
        CASE NEW.type
            WHEN 'article' THEN 1.0
            WHEN 'essay' THEN 1.0
            WHEN 'research' THEN 1.5
            WHEN 'project' THEN 2.0
            WHEN 'prototype' THEN 2.0
            WHEN 'experiment' THEN 1.8
            WHEN 'artifact' THEN 3.0
            WHEN 'community_work' THEN 2.5
            WHEN 'social_contribution' THEN 2.8
            WHEN 'certification' THEN 0.5
            WHEN 'pathway' THEN 0.8
            WHEN 'module' THEN 0.5
            WHEN 'internal_pub' THEN 4.0
            WHEN 'external_pub' THEN 3.5
            WHEN 'featured' THEN 5.0
        END
    INTO v_base, v_weight;
    
    NEW.total_score := calculate_submission_score(
        v_base,
        v_weight,
        NEW.community_rating,
        NEW.citations,
        NEW.bookmarks,
        NEW.references,
        NEW.arbiter_approved
    );
    
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_recalculate_score
    BEFORE INSERT OR UPDATE OF community_rating, citations, bookmarks, references, arbiter_approved 
    ON autoedu_submissions
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_submission_score();

-- Function to update profile stats
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update profile totals
    UPDATE autoedu_profiles
    SET 
        total_works = (SELECT COUNT(*) FROM autoedu_submissions WHERE user_id = NEW.user_id),
        total_citations = (SELECT COALESCE(SUM(citations), 0) FROM autoedu_submissions WHERE user_id = NEW.user_id),
        total_references = (SELECT COALESCE(SUM(references), 0) FROM autoedu_submissions WHERE user_id = NEW.user_id),
        total_bookmarks = (SELECT COALESCE(SUM(bookmarks), 0) FROM autoedu_submissions WHERE user_id = NEW.user_id),
        arbiter_endorsements = (SELECT COUNT(*) FROM autoedu_submissions WHERE user_id = NEW.user_id AND arbiter_approved = TRUE),
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_profile_stats
    AFTER INSERT OR UPDATE ON autoedu_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_stats();

-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

-- Enable RLS on all tables
ALTER TABLE autoedu_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE autoedu_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE autoedu_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE autoedu_arbiter_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE autoedu_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE autoedu_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE autoedu_monthly_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE autoedu_galleries ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update own
CREATE POLICY "Profiles are viewable by everyone"
    ON autoedu_profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
    ON autoedu_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON autoedu_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Submissions: Public can view approved, owners can view all
CREATE POLICY "Approved submissions are viewable by everyone"
    ON autoedu_submissions FOR SELECT 
    USING (status = 'approved' OR status = 'featured' OR auth.uid() = user_id);

CREATE POLICY "Users can create submissions"
    ON autoedu_submissions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions"
    ON autoedu_submissions FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own submissions"
    ON autoedu_submissions FOR DELETE 
    USING (auth.uid() = user_id);

-- Ratings: Viewable by all, insert/update by authenticated users (one per submission)
CREATE POLICY "Ratings are viewable by everyone"
    ON autoedu_ratings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can rate"
    ON autoedu_ratings FOR INSERT 
    WITH CHECK (auth.uid() = rater_id);

-- Engagements: Private to user, except views which are public counts
CREATE POLICY "Engagements viewable by owner"
    ON autoedu_engagements FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own engagements"
    ON autoedu_engagements FOR ALL 
    USING (auth.uid() = user_id);

-- Comments: Public on approved submissions
CREATE POLICY "Comments on approved submissions are viewable"
    ON autoedu_comments FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM autoedu_submissions 
        WHERE id = autoedu_comments.submission_id 
        AND (status = 'approved' OR status = 'featured')
    ));

CREATE POLICY "Users can comment"
    ON autoedu_comments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
-- VIEWS FOR CONVENIENT QUERIES
-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

-- Leaderboard view
CREATE VIEW autoedu_leaderboard AS
SELECT 
    p.user_id,
    p.display_name,
    p.neoscore,
    p.credibility,
    p.total_works,
    p.primary_domain,
    RANK() OVER (ORDER BY p.neoscore DESC) as rank
FROM autoedu_profiles p
WHERE p.total_works > 0;

-- Gallery-ready works view
CREATE VIEW autoedu_gallery_works AS
SELECT 
    s.*,
    p.display_name as author_name,
    p.credibility as author_credibility,
    CASE 
        WHEN s.arbiter_approved THEN 3
        WHEN s.community_rating >= 4 THEN 2
        ELSE 1
    END as quality_tier
FROM autoedu_submissions s
JOIN autoedu_profiles p ON s.user_id = p.user_id
WHERE s.status IN ('approved', 'featured');

-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
-- STORAGE BUCKETS
-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

-- Create buckets (run in Supabase dashboard or via API)
-- autoedu-documents: PDFs, Word docs
-- autoedu-images: Photos, diagrams, artwork
-- autoedu-videos: Short video evidence (<50MB)
-- autoedu-thumbnails: Auto-generated or uploaded thumbnails

-- Storage policies (to be set in Supabase dashboard):
-- - Public read for approved submissions
-- - Private upload (owner only)
-- - Auto-delete when submission deleted

-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
-- RPC FUNCTIONS FOR ATOMIC OPERATIONS
-- ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

-- Increment engagement count atomically
CREATE OR REPLACE FUNCTION increment_engagement(
  p_submission_id UUID,
  p_column TEXT,
  p_delta INTEGER
)
RETURNS VOID AS $$
BEGIN
  IF p_column = 'bookmarks' THEN
    UPDATE autoedu_submissions SET bookmarks = bookmarks + p_delta WHERE id = p_submission_id;
  ELSIF p_column = 'citations' THEN
    UPDATE autoedu_submissions SET citations = citations + p_delta WHERE id = p_submission_id;
  ELSIF p_column = 'references' THEN
    UPDATE autoedu_submissions SET references = references + p_delta WHERE id = p_submission_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment monthly stat atomically
CREATE OR REPLACE FUNCTION increment_monthly_stat(
  p_user_id UUID,
  p_year INTEGER,
  p_month INTEGER,
  p_category TEXT,
  p_type TEXT
)
RETURNS VOID AS $$
DECLARE
  v_category_column TEXT;
  v_current_type_counts JSONB;
BEGIN
  v_category_column := p_category || '_count';
  
  -- Upsert monthly stats
  INSERT INTO autoedu_monthly_stats (user_id, year, month, work_count, build_count, impact_count, academic_count, publication_count, type_counts)
  VALUES (
    p_user_id, 
    p_year, 
    p_month,
    CASE WHEN p_category = 'work' THEN 1 ELSE 0 END,
    CASE WHEN p_category = 'build' THEN 1 ELSE 0 END,
    CASE WHEN p_category = 'impact' THEN 1 ELSE 0 END,
    CASE WHEN p_category = 'academic' THEN 1 ELSE 0 END,
    CASE WHEN p_category = 'publication' THEN 1 ELSE 0 END,
    jsonb_build_object(p_type, 1)
  )
  ON CONFLICT (user_id, year, month)
  DO UPDATE SET
    work_count = CASE 
      WHEN p_category = 'work' THEN autoedu_monthly_stats.work_count + 1 
      ELSE autoedu_monthly_stats.work_count 
    END,
    build_count = CASE 
      WHEN p_category = 'build' THEN autoedu_monthly_stats.build_count + 1 
      ELSE autoedu_monthly_stats.build_count 
    END,
    impact_count = CASE 
      WHEN p_category = 'impact' THEN autoedu_monthly_stats.impact_count + 1 
      ELSE autoedu_monthly_stats.impact_count 
    END,
    academic_count = CASE 
      WHEN p_category = 'academic' THEN autoedu_monthly_stats.academic_count + 1 
      ELSE autoedu_monthly_stats.academic_count 
    END,
    publication_count = CASE 
      WHEN p_category = 'publication' THEN autoedu_monthly_stats.publication_count + 1 
      ELSE autoedu_monthly_stats.publication_count 
    END,
    type_counts = COALESCE(autoedu_monthly_stats.type_counts, '{}'::jsonb) || 
      jsonb_build_object(p_type, COALESCE((autoedu_monthly_stats.type_counts->>p_type)::int, 0) + 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get structured feed (publications, research, debates, observations)
CREATE OR REPLACE FUNCTION get_structured_feed(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  type TEXT,
  category TEXT,
  domain TEXT,
  title TEXT,
  abstract TEXT,
  status TEXT,
  total_score DECIMAL,
  community_rating DECIMAL,
  citations INTEGER,
  bookmarks INTEGER,
  arbiter_approved BOOLEAN,
  featured BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  feed_type TEXT,
  author_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH publications AS (
    SELECT 
      s.*, 
      'publication'::text as feed_type,
      p.display_name as author_name,
      ROW_NUMBER() OVER (ORDER BY s.created_at DESC) as rn
    FROM autoedu_submissions s
    JOIN autoedu_profiles p ON s.user_id = p.user_id
    WHERE s.category = 'publication' AND s.status IN ('approved', 'featured')
    ORDER BY s.created_at DESC
    LIMIT p_limit / 4
  ),
  research AS (
    SELECT 
      s.*, 
      'research_question'::text as feed_type,
      p.display_name as author_name,
      ROW_NUMBER() OVER (ORDER BY s.community_rating DESC) as rn
    FROM autoedu_submissions s
    JOIN autoedu_profiles p ON s.user_id = p.user_id
    WHERE s.type = 'research' AND s.arbiter_approved = true AND s.status IN ('approved', 'featured')
    ORDER BY s.community_rating DESC
    LIMIT p_limit / 4
  ),
  debates AS (
    SELECT 
      s.*, 
      'debate'::text as feed_type,
      p.display_name as author_name,
      ROW_NUMBER() OVER (ORDER BY c.comment_count DESC) as rn
    FROM autoedu_submissions s
    JOIN autoedu_profiles p ON s.user_id = p.user_id
    LEFT JOIN (
      SELECT submission_id, COUNT(*) as comment_count 
      FROM autoedu_comments 
      GROUP BY submission_id
      HAVING COUNT(*) > 3
    ) c ON s.id = c.submission_id
    WHERE s.status IN ('approved', 'featured') AND c.comment_count > 3
    ORDER BY c.comment_count DESC
    LIMIT p_limit / 4
  ),
  observations AS (
    SELECT 
      s.*, 
      'field_observation'::text as feed_type,
      p.display_name as author_name,
      ROW_NUMBER() OVER (ORDER BY s.total_score DESC) as rn
    FROM autoedu_submissions s
    JOIN autoedu_profiles p ON s.user_id = p.user_id
    WHERE s.category = 'impact' AND s.status IN ('approved', 'featured')
    ORDER BY s.total_score DESC
    LIMIT p_limit / 4
  )
  SELECT * FROM publications
  UNION ALL
  SELECT * FROM research
  UNION ALL
  SELECT * FROM debates
  UNION ALL
  SELECT * FROM observations
  ORDER BY created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate user's neoscore
CREATE OR REPLACE FUNCTION calculate_user_neoscore(p_user_id UUID)
RETURNS TABLE (
  total INTEGER,
  learning_activity INTEGER,
  portfolio_quality INTEGER,
  impact_contribution INTEGER,
  domain_balance INTEGER,
  peer_validation INTEGER
) AS $$
DECLARE
  v_learning_activity INTEGER;
  v_portfolio_quality INTEGER;
  v_impact INTEGER;
  v_domain_balance INTEGER;
  v_peer INTEGER;
  v_total INTEGER;
BEGIN
  -- Learning Activity (30%): unique domains
  SELECT LEAST(COUNT(DISTINCT domain) * 3, 30)
  INTO v_learning_activity
  FROM autoedu_submissions
  WHERE user_id = p_user_id AND status IN ('approved', 'featured');
  
  -- Portfolio Quality (25%): average score
  SELECT LEAST(AVG(total_score) * 2, 25)
  INTO v_portfolio_quality
  FROM autoedu_submissions
  WHERE user_id = p_user_id AND status IN ('approved', 'featured');
  
  -- Impact (20%): impact category works
  SELECT LEAST(COUNT(*) * 5, 20)
  INTO v_impact
  FROM autoedu_submissions
  WHERE user_id = p_user_id AND category = 'impact' AND status IN ('approved', 'featured');
  
  -- Domain Balance (15%): category diversity
  SELECT COUNT(DISTINCT category) * 3
  INTO v_domain_balance
  FROM autoedu_submissions
  WHERE user_id = p_user_id AND status IN ('approved', 'featured');
  
  -- Peer Validation (10%): engagement
  SELECT LEAST(SUM(citations + bookmarks + references) * 2, 10)
  INTO v_peer
  FROM autoedu_submissions
  WHERE user_id = p_user_id AND status IN ('approved', 'featured');
  
  v_total := v_learning_activity + v_portfolio_quality + v_impact + v_domain_balance + v_peer;
  
  RETURN QUERY SELECT v_total, v_learning_activity, v_portfolio_quality, v_impact, v_domain_balance, v_peer;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update all user neoscores (run periodically)
CREATE OR REPLACE FUNCTION update_all_neoscores()
RETURNS VOID AS $$
DECLARE
  r RECORD;
  v_scores RECORD;
BEGIN
  FOR r IN SELECT user_id FROM autoedu_profiles WHERE total_works > 0
  LOOP
    SELECT * INTO v_scores FROM calculate_user_neoscore(r.user_id);
    
    UPDATE autoedu_profiles
    SET 
      neoscore = v_scores.total,
      neoscore_breakdown = jsonb_build_object(
        'learningActivity', v_scores.learning_activity,
        'portfolioQuality', v_scores.portfolio_quality,
        'impactContribution', v_scores.impact_contribution,
        'domainBalance', v_scores.domain_balance,
        'peerValidation', v_scores.peer_validation
      )
    WHERE user_id = r.user_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
